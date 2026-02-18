const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { WAREHOUSE_PAYMENT_MASTER, WAREHOUSE_PAYMENT_DETAIL } = require("../../warehouse_payment/commons/constants");
const { PURCHASE_FMCG_MASTER, PARTY_LEDGER } = require("../../purchase/commons");
const { SUPPLIER } = require("../../catalog/supplier/commons/constants");


function getWareousePaymentRepo(fastify) {

    async function postWarehousePaymentRepo({ params, body, logTrace, userDetails }) {

        const knex = this;
        const trx = await knex.transaction();

        try {

            const query_insert = trx(`${WAREHOUSE_PAYMENT_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.DATE]: body.date,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.MODE]: body.mode,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.AMOUNT]: body.amount,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.CHEQUE_NO]: body.cheque_no,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.CHEQUE_DATE]: body.cheque_date,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.BANK]: body.bank,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.DISCOUNT]: body.discount,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.REF_NO]: body.ref_no,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.CREATED_BY]: userDetails.id
                });

            const response = await query_insert;
            const warehousePaymentMasterId = response[0].id;

            const paymentMasterDetails = await trx(WAREHOUSE_PAYMENT_MASTER.NAME)
                .select(WAREHOUSE_PAYMENT_MASTER.COLUMNS.DOC_NO)
                .where(WAREHOUSE_PAYMENT_MASTER.COLUMNS.WAREHOUSE_ID, body.warehouse_id)
                .orderBy(WAREHOUSE_PAYMENT_MASTER.COLUMNS.ID, 'desc')
                .first()
                .forUpdate();

            const lastDocNo = Number(paymentMasterDetails?.doc_no || 0);
            const billno = lastDocNo + 1;

            await trx(WAREHOUSE_PAYMENT_MASTER.NAME)
                .where(WAREHOUSE_PAYMENT_MASTER.COLUMNS.ID, warehousePaymentMasterId)
                .update({
                    [WAREHOUSE_PAYMENT_MASTER.COLUMNS.DOC_NO]: billno
                });


            let totalPendingAmount = 0;

            if (Array.isArray(body.warehouse_payment_details)) {

                totalPendingAmount = body.warehouse_payment_details.reduce(
                    (sum, item) => sum + Number(item.pending_amount || 0),
                    0
                );

                for (const element of body.warehouse_payment_details) {

                    await trx(`${WAREHOUSE_PAYMENT_DETAIL.NAME}`).insert({
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.WP_MST_ID]: warehousePaymentMasterId,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.DATE]: element.bill_date,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.INVOICE_NO]: element.invoice_no,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.AMOUNT]: element.bill_amount,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.PENDING_AMOUNT]: element.pending_amount,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.COMPANY_ID]: body.company_id,
                        [WAREHOUSE_PAYMENT_DETAIL.COLUMNS.CREATED_BY]: userDetails.id
                    });

                }

            } else {
                console.error("warehouse payment details is not an array");
            }


            if (body.amount) {

                await trx(`${SUPPLIER.NAME}`)
                    .where(`${SUPPLIER.COLUMNS.ID}`, body.supplier_id)
                    .andWhere(`${SUPPLIER.COLUMNS.COMPANY_ID}`, body.company_id)
                    .update({
                        [SUPPLIER.COLUMNS.BALANCE]: trx.raw(
                            `${SUPPLIER.COLUMNS.BALANCE} - ${body.amount}`
                        )
                    });

            }


            await trx(PARTY_LEDGER.NAME).insert({
                [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: warehousePaymentMasterId,
                [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.supplier_id,
                [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: warehousePaymentMasterId,
                [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "E",
                [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: 0,
                [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: totalPendingAmount || body.amount,
                [PARTY_LEDGER.COLUMNS.REMARKS]: `Purchase No (${warehousePaymentMasterId})`,
                [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'S',
                [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.warehouse_id || 1,
                [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });


            if (Array.isArray(body.warehouse_payment_details)) {

                for (const element of body.warehouse_payment_details) {

                    const itemQuery = trx(PURCHASE_FMCG_MASTER.NAME).where({
                        [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                        [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: element.invoice_no
                    })
                        .first();

                    const existsResponse = await itemQuery;

                    if (existsResponse) {

                        await trx(PURCHASE_FMCG_MASTER.NAME)
                            .where({
                                [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                                [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                                [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: element.invoice_no

                            })
                            .update({
                                [PURCHASE_FMCG_MASTER.COLUMNS.OUTSTANDING_AMT]: trx.raw(
                                    `${PURCHASE_FMCG_MASTER.COLUMNS.OUTSTANDING_AMT} + ${element.pending_amount}`
                                )
                            });

                    }

                    const warehousePurchaseMaster = trx(PURCHASE_FMCG_MASTER.NAME).where({
                        [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                        [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                        [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: element.invoice_no
                    })
                        .first();

                    const existsWarehousePurchaseMaster = await warehousePurchaseMaster;

                    const warehousePurchaseGrandTotalAmt = existsWarehousePurchaseMaster?.grand_total
                    const warehousePurchaseOutstandingAmt = existsWarehousePurchaseMaster?.outstanding_amt

                    if (warehousePurchaseGrandTotalAmt == warehousePurchaseOutstandingAmt) {
                        await trx(PURCHASE_FMCG_MASTER.NAME)
                            .where({
                                [PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID]: body.supplier_id,
                                [PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
                                [PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO]: element.invoice_no
                            })
                            .update({
                                [PURCHASE_FMCG_MASTER.COLUMNS.IS_PAID]: true
                            });
                    }
                }
            }

            await trx.commit();

            return { success: true };

        } catch (error) {

            /* ---------- ROLLBACK ---------- */
            await trx.rollback();

            console.error("Warehouse Payment Error:", error);
            throw error;
        }
    }

    async function getWareousePaymentOutstandingBillSupplierlistRepo({ body, params, logTrace }) {
        const knex = this;
        const { warehouse_id } = params
        const query = knex
            .select([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`
            ])
            .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
            .innerJoin(
                `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            )
            .where(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID}`, warehouse_id)
            .andWhere(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.IS_PAID}`, false)
            .groupBy(
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`
            );


        logQuery({
            logger: fastify.log,
            query,
            context: "Get Supplier list",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "supplier list data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function getWareousePaymentOutstandingBillSupplierlDetailsRepo({ body, params, logTrace }) {
        const knex = this;
        const { supplier_id } = params;
        const query = knex
            .select([
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1} as supplier_address`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`,
                `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as supplier_balance`
            ])
            .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
            .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, supplier_id)
            .first()

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Supplier list",
            logTrace
        });
        const response = await query;
        if (!response) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "supplier list data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;

    }

    async function getWareousePaymentOutstandingBillListRepo({ body, params, logTrace }) {
        const knex = this;
        const { warehouse_id, supplier_id, page_size, current_page } = params;

        const query = knex
            .select([
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_NO} as bill_no`,
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE} as bill_date`,
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.GRAND_TOTAL} as bill_amount`,
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.OUTSTANDING_AMT} as outstanding_amt`,
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.INVOICE_NO} as invoice_no`
            ])
            .from(`${PURCHASE_FMCG_MASTER.NAME} as ${PURCHASE_FMCG_MASTER.NAME}`)
            .where(
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID}`,
                warehouse_id
            )
            .andWhere(
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
                supplier_id
            )
            .andWhere(
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.IS_PAID}`,
                false
            )

            .orderBy(
                `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`,
                'DESC'
            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Outstanding Bill List",
            logTrace
        });

        const response = await query.paginate({
            pageSize: page_size,
            currentPage: current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response
    }



    return {
        postWarehousePaymentRepo,
        getWareousePaymentOutstandingBillSupplierlistRepo,
        getWareousePaymentOutstandingBillSupplierlDetailsRepo,
        getWareousePaymentOutstandingBillListRepo
    };
}
module.exports = getWareousePaymentRepo

