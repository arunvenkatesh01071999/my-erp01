const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const _ = require('lodash');
const { logQuery } = require("../../../commons/helpers");
const { ITEM, CUSTOMER_PRODUCTS_MAPPING, CUSTOMER } = require("../../../catalog/commons");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { SALES_FMCG_MASTER, SALES_FMCG_DETAILS, STOCKLEDGER } = require("../../sales_fmcg_master/commons/constants");
const { SALES_RETURN, SALES_RETURN_DETAILS, CLOSINGSTOCK } = require("../commons/constants");


function SalesReturnApprovalRepo(fastify) {

    async function UpdateSalesReturnApproval({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const now = new Date();
        const salesReturnId = params.sales_return_id;
        const docdate = body.docdate;

        return knex.transaction(async trx => {

            const existing = await trx(SALES_RETURN.NAME)
                .returning("id")
                .where(SALES_RETURN.COLUMNS.ID, salesReturnId)
                .first();

            if (!existing) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Sales Return does not exist",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            // 1. Update SALES_RETURN with Approval
            await trx(SALES_RETURN.NAME)
                .where(SALES_RETURN.COLUMNS.ID, salesReturnId)
                .update({
                    [SALES_RETURN.COLUMNS.APP_FLAG]: 1,
                    [SALES_RETURN.COLUMNS.REMARK]: body.remark || null,
                    [SALES_RETURN.COLUMNS.UPDATED_BY]: userDetails.id,
                    [SALES_RETURN.COLUMNS.UPDATED_AT]: now,
                });

            // 2. Loop over each return item and update StockLedger
            for (const item of body.detail) {
                const productId = item.product_id;
                const qty = parseFloat(item.qty) || 0;

                const existingStock = await trx(STOCKLEDGER.NAME)
                    .where({
                        [STOCKLEDGER.COLUMNS.PROD_ID]: productId,
                        [STOCKLEDGER.COLUMNS.DATE]: docdate,
                    })
                    .first();

                if (existingStock) {
                    await trx(STOCKLEDGER.NAME)
                        .where({
                            [STOCKLEDGER.COLUMNS.PROD_ID]: productId,
                            [STOCKLEDGER.COLUMNS.DATE]: docdate,
                        })
                        .update({
                            [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: trx.raw(
                                `${STOCKLEDGER.COLUMNS.SALES_RETURN_QTY} + ?`,
                                [qty]
                            ),
                        });
                } else {
                    await trx(STOCKLEDGER.NAME).insert({
                        [STOCKLEDGER.COLUMNS.DATE]: docdate,
                        [STOCKLEDGER.COLUMNS.PROD_ID]: productId,
                        [STOCKLEDGER.COLUMNS.SALE_QTY]: 0,
                        [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: qty,
                        [STOCKLEDGER.COLUMNS.COMPANY_ID]: userDetails.company_id,
                        [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id,
                        [STOCKLEDGER.COLUMNS.CREATED_AT]: now
                    });
                }
            }

            return { success: true };
        });
    }


    async function generatSalesReturnApprovalDocno({ logTrace }) {
        const knex = this;

        const query = knex(SALES_RETURN.NAME)
            .returning("id")
            .orderBy(SALES_RETURN.COLUMNS.ID, "desc")
            .limit(1);

        logQuery({
            logger: fastify.log,
            query,
            context: "Get fmcg Packing Planning docno",
            logTrace
        });

        const response = await query;

        if (response.length === 0) {
            return { docno: 1 };
        }

        const docno = response[0].id;

        const new_docno = `${docno + 1}`;

        return { docno: new_docno };
    }

    async function getAllSalesReturnApproval({ queryString, logTrace, params }) {
        const knex = this;
        const { from_date, to_date, search, sale_return_app_flag } = queryString;

        const query = knex
            .select([
                `${SALES_RETURN.NAME}.*`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`
            ])
            .from(`${SALES_RETURN.NAME} as ${SALES_RETURN.NAME}`)
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
                `${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.CUSTOMER_ID}`
            )
        if (sale_return_app_flag) {
            query.where(`${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.APP_FLAG}`, sale_return_app_flag)
        }
        if (from_date) {
            query.whereRaw(
                `DATE(${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.DOCDATE}) >= ?`,
                [from_date]
            );
        }

        if (to_date) {
            query.whereRaw(
                `DATE(${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.DOCDATE}) <= ?`,
                [to_date]
            );
        }

        if (search) {
            query.where(builder =>
                builder
                    .where(`${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.INVOICE_NO}`, 'like', `%${search}%`)
                    .orWhere(`${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME}`, 'like', `%${search}%`)
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get All Sales Return Records with Header and Detail GST Data",
            logTrace
        });

        const response = await query.paginate({
            pageSize: params.page_size,
            currentPage: params.current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }



    async function getSalesReturnApprovalById({ params, logTrace }) {
        const knex = this;
        const { id } = params;
        console.log(id, "param id")

        // Fetch header
        const headerQuery = knex
            .select([
                `${SALES_RETURN.NAME}.*`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`
            ])
            .from(`${SALES_RETURN.NAME} as ${SALES_RETURN.NAME}`)
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
                `${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.CUSTOMER_ID}`
            )
            .where(`${SALES_RETURN.NAME}.${SALES_RETURN.COLUMNS.ID}`, id) // Explicitly reference the `id` column from `sales_return`
            .first();

        logQuery({
            logger: fastify.log,
            query: headerQuery,
            context: "Get Sales Return Header By ID",
            logTrace
        });

        const header = await headerQuery;

        if (!header) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return record not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        // Fetch details
        const detailQuery = knex
            .select([
                `${SALES_RETURN_DETAILS.NAME}.*`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`
            ])
            .from(`${SALES_RETURN_DETAILS.NAME} as ${SALES_RETURN_DETAILS.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID}`
            )
            .where(`${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID}`, id); // Same here

        logQuery({
            logger: fastify.log,
            query: detailQuery,
            context: "Get Sales Return Details By Header ID",
            logTrace
        });

        const details = await detailQuery;

        if (!details.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return details not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return {
            ...header,
            details
        };
    }

    async function ReverseSalesReturnApproval({ params, body, userDetails }) {
        const knex = this;
        const now = new Date();
        const salesReturnId = params.sales_return_id;
        const docdate = body.docdate;
        console.log(salesReturnId, "paramsid")

        return knex.transaction(async trx => {
            // 1. Check if already approved
            const existing = await trx(SALES_RETURN.NAME)
                .returning("id")
                .where(SALES_RETURN.COLUMNS.ID, salesReturnId)
                .first();
            console.log(existing, "existing condition")
            if (!existing) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Sales Return is not approved or does not exist",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            // 2. Check if stock is closed for this date (if you have a stock closing table)
            const isStockClosed = await trx(CLOSINGSTOCK.NAME)
                .where(CLOSINGSTOCK.COLUMNS.DOCDATE, docdate)
                .first();

            if (isStockClosed) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Stock already closed for this date. Cannot reverse approval.",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            // 3. Revert APP_FLAG and approval fields
            await trx(SALES_RETURN.NAME)
                .where(SALES_RETURN.COLUMNS.ID, salesReturnId)
                .update({
                    [SALES_RETURN.COLUMNS.APP_FLAG]: 0,
                    [SALES_RETURN.COLUMNS.UPDATED_AT]: null,
                    [SALES_RETURN.COLUMNS.UPDATED_BY]: null,
                    [SALES_RETURN.COLUMNS.UPDATED_BY]: userDetails.id,
                    [SALES_RETURN.COLUMNS.UPDATED_AT]: new Date(),
                });

            // 4. Load approved return details
            const approvedDetails = await trx(SALES_RETURN_DETAILS.NAME)
                .select(
                    SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID,
                    SALES_RETURN_DETAILS.COLUMNS.QTY
                )
                .where(SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID, salesReturnId);

            // 5. Revert StockLedger entries
            for (const item of approvedDetails) {
                await trx(STOCKLEDGER.NAME)
                    .where({
                        [STOCKLEDGER.COLUMNS.PROD_ID]: item.product_id,
                        [STOCKLEDGER.COLUMNS.DATE]: docdate
                    })
                    .update({
                        [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: trx.raw(
                            `${STOCKLEDGER.COLUMNS.SALES_RETURN_QTY} - ?`,
                            [parseFloat(item.qty)]
                        ),
                        [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id,
                        [STOCKLEDGER.COLUMNS.UPDATED_AT]: now,
                    });
            }

            return { success: true };
        });
    }





    return {
        UpdateSalesReturnApproval,
        generatSalesReturnApprovalDocno,
        getAllSalesReturnApproval,
        getSalesReturnApprovalById,
        ReverseSalesReturnApproval
    };
}

module.exports = SalesReturnApprovalRepo;
