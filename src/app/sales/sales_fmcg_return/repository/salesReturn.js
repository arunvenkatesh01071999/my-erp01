const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const _ = require('lodash');
const { logQuery } = require("../../../commons/helpers");
const { ITEM, CUSTOMER_PRODUCTS_MAPPING, CUSTOMER } = require("../../../catalog/commons");
const { UNITS } = require("../../../catalog/units/commons/constants");
const { SALES_FMCG_MASTER, SALES_FMCG_DETAILS } = require("../../sales_fmcg_master/commons/constants");
const { SALES_RETURN_MASTER, SALES_RETURN_DETAILS, STORE_RETURN, STORE_RETURN_FMCG, PARTY_LEDGER } = require("../commons/constants");
const { REASON } = require("../../../catalog/reason/commons/constants")

function SalesReturnRepo(fastify) {
    async function postSalesReturnRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;

        // Start a transaction
        const trx = await knex.transaction();
        try {
            // Step 1: Available Balance Check
            if (_.isArray(body.sales_return_details) && body.sales_return_details.length > 0) {
                await Promise.all(
                    body.sales_return_details.map(async (element) => {
                        const stockDetails = await trx(ITEM.NAME)
                            .select(
                                ITEM.COLUMNS.BALANCE,
                                ITEM.COLUMNS.PRODUCT_NAME
                            )
                            .where({ [ITEM.COLUMNS.ID]: element.product_id })
                            .first();

                        const balance = parseFloat(stockDetails?.balance) || 0;
                        const productName = String(stockDetails?.pro_name);
                        const returnQty = parseFloat(element.wh_stock) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const salesMasterId = Number(body.sales_master_id)
                        if (salesMasterId != 0) {
                            const actualQty = parseFloat(element.actual_qty) || 0;
                            if (returnQty > actualQty) {
                                throw CustomError.create({
                                    httpCode: StatusCodes.NOT_FOUND,
                                    message: `Actual Qty (${actualQty}) is less than return qty (${returnQty}) for Product Name ${productName}`,
                                    property: "balance",
                                    code: "STOCK_MISMATCHED"
                                });
                            }
                        }
                    })
                );
            }

            // Step 2: Get Customer Gst_Type
            const customerDetails = await knex(CUSTOMER.NAME)
                .select(
                    `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`,
                    `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE}`
                )
                .where(CUSTOMER.COLUMNS.ID, body.customer_id)
                .first()

            const { gst_type, customer_type } = customerDetails;

            // Step 3: Insert into Purchase Return Master and retrieve the inserted ID
            const [response] = await trx(`${SALES_RETURN_MASTER.NAME}`)
                .returning("id")
                .insert({
                    [SALES_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [SALES_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID]: body.customer_id,
                    [SALES_RETURN_MASTER.COLUMNS.CUSTOMER_TYPE]: customer_type,
                    [SALES_RETURN_MASTER.COLUMNS.SUB_TOTAL_AMOUNT]: body.sub_total_amount,
                    [SALES_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount,
                    [SALES_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
                    [SALES_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL]: body.grand_total || 0,
                    [SALES_RETURN_MASTER.COLUMNS.SALES_MASTER_ID]: body.sales_master_id,
                    [SALES_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                    [SALES_RETURN_MASTER.COLUMNS.ROUND_OFF]: body.round_off,
                    [SALES_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [SALES_RETURN_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id || 1,
                    [SALES_RETURN_MASTER.COLUMNS.SALES_RETURN_TYPE]: body.return_type,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_GST_AMOUNT]: Number(gst_type) === 1 ? Number(body.total_gst_amount) : 0,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMOUNT]: Number(gst_type) === 2 ? Number(body.total_igst_amount) : 0,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: body.total_cess_amount || 0,
                    [SALES_RETURN_MASTER.COLUMNS.SALE_TYPE]: body.sale_type,
                    [SALES_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [SALES_RETURN_MASTER.COLUMNS.APP_FLAG]: body.app_flag,
                    [SALES_RETURN_MASTER.COLUMNS.EINVOICE]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                    [SALES_RETURN_MASTER.COLUMNS.AKNO]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.CREATED_AT]: new Date(),
                    [SALES_RETURN_MASTER.COLUMNS.CREATED_BY]: userDetails.id
                });

            const sales_return_mst_id = response.id;
            const docno = `${sales_return_mst_id}`;

            // Step 4: Update DOCNO in Purchase Return Master
            await trx(`${SALES_RETURN_MASTER.NAME}`)
                .where(SALES_RETURN_MASTER.COLUMNS.ID, sales_return_mst_id)
                .update({
                    [SALES_RETURN_MASTER.COLUMNS.DOCNO]: docno
                });

            // Step 5: Insert into Purchase Return Details
            if (_.isArray(body.sales_return_details) && body.sales_return_details.length > 0) {
                const salesReturnDetailsData = _.map(body.sales_return_details, (element) => ({
                    [SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID]: sales_return_mst_id,
                    [SALES_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [SALES_RETURN_DETAILS.COLUMNS.BATCHNO]: element.batch_no,
                    [SALES_RETURN_DETAILS.COLUMNS.EXP_DATE]: element.exp_date || new Date(),
                    [SALES_RETURN_DETAILS.COLUMNS.ACT_QTY]: Number(element.actual_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.RETURN_QTY]: Number(element.return_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.ACT_FREE]: Number(element.actual_free_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: Number(element.return_free_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.TEMP_RETURN_QTY]: Number(element.wh_stock) + Number(element.return_free_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.TEMP_DNE_QTY]: Number(element.dne),
                    [SALES_RETURN_DETAILS.COLUMNS.DISCOUNT]: Number(element.discount),
                    [SALES_RETURN_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: Number(element.discount_amount),
                    [SALES_RETURN_DETAILS.COLUMNS.RATE]: Number(element.rate),
                    [SALES_RETURN_DETAILS.COLUMNS.AMOUNT]: Number(element.amount),
                    [SALES_RETURN_DETAILS.COLUMNS.REASON]: Number(element.reason),
                    [SALES_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 1) ? Number(element.gst) : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 1) ? Number(element.gst) / 2 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 1) ? Number(element.gst) / 2 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.gst) * Number(element.return_qty) * Number(element.rate) / 100 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 2) ? Number(element.gst) : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.gst) * Number(element.return_qty) * Number(element.rate) / 100 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CESS]: Number(element.cess) || 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CESS_AMOUNT]: Number(element.cess_amount) || 0,
                    [SALES_RETURN_DETAILS.COLUMNS.SALE_TYPE]: Number(element.sale_type),
                    [SALES_RETURN_DETAILS.COLUMNS.MRP]: Number(element.mrp),
                    [SALES_RETURN_DETAILS.COLUMNS.WH_STOCK]: Number(element.wh_stock),
                    [SALES_RETURN_DETAILS.COLUMNS.DNE]: Number(element.dne),
                    [SALES_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [SALES_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                    [SALES_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                }));

                // Batch insert in chunks of 1000 records
                if (salesReturnDetailsData.length > 0) {
                    await trx.batchInsert(SALES_RETURN_DETAILS.NAME, salesReturnDetailsData, 1000);
                }
            }

            // Step 6: Insert Party Ledger
            await trx(PARTY_LEDGER.NAME).insert({
                [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: sales_return_mst_id,
                [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
                [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "SR",
                [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: body.grand_total,
                [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
                [PARTY_LEDGER.COLUMNS.REMARKS]: body.invoice_no || `Sales Return no (${docno})`,
                [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'C',
                [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
            });

            // Commit the transaction
            await trx.commit();
            return { success: true, docno: docno };
        } catch (error) {
            // Rollback transaction in case of error
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);
            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }

            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Sales Return transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function putSalesReturnRepo({ params, body, logTrace, userDetails, financialYear }) {
        const knex = this;
        const sales_return_mst_id = params.id;
        // Start a transaction
        const trx = await knex.transaction();
        try {
            // Step 1: Available Balance Check
            if (_.isArray(body.sales_return_details) && body.sales_return_details.length > 0) {
                await Promise.all(
                    body.sales_return_details.map(async (element) => {
                        const stockDetails = await trx(ITEM.NAME)
                            .select(
                                ITEM.COLUMNS.BALANCE,
                                ITEM.COLUMNS.PRODUCT_NAME
                            )
                            .where({ [ITEM.COLUMNS.ID]: element.product_id })
                            .first();

                        const balance = parseFloat(stockDetails?.balance) || 0;
                        const productName = String(stockDetails?.pro_name);
                        const returnQty = parseFloat(element.wh_stock) || 0;
                        const returnFreeQty = parseFloat(element.return_free_qty) || 0;
                        const totalReturnQty = returnQty + returnFreeQty;
                        const salesMasterId = Number(body.sales_master_id)
                        if (salesMasterId != 0) {
                            const actualQty = parseFloat(element.actual_qty) || 0;
                            if (returnQty > actualQty) {
                                throw CustomError.create({
                                    httpCode: StatusCodes.NOT_FOUND,
                                    message: `Actual Qty (${actualQty}) is less than return qty (${returnQty}) for Product Name ${productName}`,
                                    property: "balance",
                                    code: "STOCK_MISMATCHED"
                                });
                            }
                        }
                    })
                );
            }

            // Step 2: Get Customer Gst_Type
            const customerDetails = await knex(CUSTOMER.NAME)
                .select(
                    `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE}`,
                    `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE}`
                )
                .where(CUSTOMER.COLUMNS.ID, body.customer_id)
                .first()

            const { gst_type, customer_type } = customerDetails;

            // Step 3: Chek PURCHASE_FMCG_RETURN_MASTER_ID Already Exists
            const existingSalesReturnDetails = await trx(SALES_RETURN_MASTER.NAME)
                .select(
                    `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.ID}`,
                    `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.TEMP_GRAND_TOTAL}`,
                    `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.SALES_MASTER_ID}`,
                    `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.DOCNO}`
                )
                .where({
                    [SALES_RETURN_MASTER.COLUMNS.ID]: sales_return_mst_id
                })
                .first();

            if (!existingSalesReturnDetails && !existingSalesReturnDetails?.id) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Sales Return Details was not found",
                    property: "",
                    code: "NOT_FOUND"
                });
            }
            const existingGrandTotal = Number(existingSalesReturnDetails.temp_grand_total) || 0;
            const grandTotalAmount = Number(body.grand_total) || 0;
            const sales_master_id = Number(existingSalesReturnDetails.sales_master_id) || 0;
            const docno = String(existingSalesReturnDetails.docno);
            // Step 4: Update the Sales FMCG Return Master record based on the given `grn_id`
            const salesReturnUpdateResponse = await trx(`${SALES_RETURN_MASTER.NAME}`)
                .where({
                    [SALES_RETURN_MASTER.COLUMNS.ID]: sales_return_mst_id // Find the record by ID
                })
                .update({
                    [SALES_RETURN_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [SALES_RETURN_MASTER.COLUMNS.DOCDATE]: new Date(),
                    [SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID]: body.customer_id,
                    [SALES_RETURN_MASTER.COLUMNS.CUSTOMER_TYPE]: customer_type,
                    [SALES_RETURN_MASTER.COLUMNS.SUB_TOTAL_AMOUNT]: body.sub_total_amount,
                    [SALES_RETURN_MASTER.COLUMNS.DISCOUNT]: body.discount,
                    [SALES_RETURN_MASTER.COLUMNS.GRAND_TOTAL]: body.grand_total || 0,
                    [SALES_RETURN_MASTER.COLUMNS.SALES_MASTER_ID]: sales_master_id,
                    [SALES_RETURN_MASTER.COLUMNS.INVOICE_NO]: body.invoice_no || " ",
                    [SALES_RETURN_MASTER.COLUMNS.ROUND_OFF]: body.round_off,
                    [SALES_RETURN_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
                    [SALES_RETURN_MASTER.COLUMNS.WAREHOUSE_ID]: body.warehouse_id || 1,
                    [SALES_RETURN_MASTER.COLUMNS.SALES_RETURN_TYPE]: body.return_type,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_GST_AMOUNT]: Number(gst_type) === 1 ? Number(body.total_gst_amount) : 0,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMOUNT]: Number(gst_type) === 2 ? Number(body.total_igst_amount) : 0,
                    [SALES_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT]: Number(body.total_cess_amount) || 0,
                    [SALES_RETURN_MASTER.COLUMNS.SALE_TYPE]: Number(body.sale_type),
                    [SALES_RETURN_MASTER.COLUMNS.REMARK]: body.remark || " ",
                    [SALES_RETURN_MASTER.COLUMNS.APP_FLAG]: body.app_flag,
                    [SALES_RETURN_MASTER.COLUMNS.EINVOICE]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.AK_DATE]: new Date(),
                    [SALES_RETURN_MASTER.COLUMNS.AKNO]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.IRNNO]: 0,
                    [SALES_RETURN_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
                    [SALES_RETURN_MASTER.COLUMNS.UPDATED_AT]: new Date()
                });

            // Step 5: If no rows were updated, throw an error (i.e., invalid `grn_id` or record not found)
            if (salesReturnUpdateResponse === 0) {
                throw CustomError.create({
                    httpCode: StatusCodes.NOT_FOUND,
                    message: "Failed to update sales return details",
                    property: "",
                    code: "NOT_FOUND"
                });
            }

            // Step 6: Insert `SALES_FMCG_RETURN_DETAILS` (if provided)
            if (_.isArray(body.sales_return_details) && body.sales_return_details.length > 0) {
                const salesDetailsData = _.map(body.sales_return_details, (element) => ({
                    [SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID]: sales_return_mst_id,
                    [SALES_RETURN_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
                    [SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID]: element.product_id,
                    [SALES_RETURN_DETAILS.COLUMNS.BATCHNO]: element.batch_no,
                    [SALES_RETURN_DETAILS.COLUMNS.EXP_DATE]: element.exp_date || new Date(),
                    [SALES_RETURN_DETAILS.COLUMNS.ACT_QTY]: Number(element.actual_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.RETURN_QTY]: Number(element.return_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.ACT_FREE]: Number(element.actual_free_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY]: Number(element.return_free_qty),
                    [SALES_RETURN_DETAILS.COLUMNS.DISCOUNT]: Number(element.discount),
                    [SALES_RETURN_DETAILS.COLUMNS.DISCOUNT_AMOUNT]: Number(element.discount_amount),
                    [SALES_RETURN_DETAILS.COLUMNS.RATE]: Number(element.rate),
                    [SALES_RETURN_DETAILS.COLUMNS.AMOUNT]: Number(element.amount),
                    [SALES_RETURN_DETAILS.COLUMNS.REASON]: Number(element.reason),
                    [SALES_RETURN_DETAILS.COLUMNS.GST]: (Number(gst_type) === 1) ? Number(element.gst) : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CGST]: (Number(gst_type) === 1) ? Number(element.gst) / 2 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.SGST]: (Number(gst_type) === 1) ? Number(element.gst) / 2 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.GST_AMOUNT]: (Number(gst_type) === 1) ? Number(element.gst) * Number(element.return_qty) * Number(element.rate) / 100 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.IGST]: (Number(gst_type) === 2) ? Number(element.gst) : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.IGST_AMOUNT]: (Number(gst_type) === 2) ? Number(element.gst) * Number(element.return_qty) * Number(element.rate) / 100 : 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CESS]: Number(element.cess) || 0,
                    [SALES_RETURN_DETAILS.COLUMNS.CESS_AMOUNT]: Number(element.cess_amount) || 0,
                    [SALES_RETURN_DETAILS.COLUMNS.SALE_TYPE]: Number(element.sale_type),
                    [SALES_RETURN_DETAILS.COLUMNS.MRP]: Number(element.mrp),
                    [SALES_RETURN_DETAILS.COLUMNS.WH_STOCK]: Number(element.wh_stock),
                    [SALES_RETURN_DETAILS.COLUMNS.DNE]: Number(element.dne),
                    [SALES_RETURN_DETAILS.COLUMNS.COMPANY_ID]: body.company_id,
                    [SALES_RETURN_DETAILS.COLUMNS.CREATED_AT]: new Date(),
                    [SALES_RETURN_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
                }));

                // Batch insert in chunks of 1000 records
                if (salesDetailsData.length > 0) {
                    for (let i = 0; i < salesDetailsData.length; i += 1000) {
                        const batch = salesDetailsData.slice(i, i + 1000);

                        await trx(SALES_RETURN_DETAILS.NAME)
                            .insert(batch)
                            .onConflict([SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID, SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID])
                            .merge(); // merge will update if conflict happens, else insert
                    }
                }
            }

            // Step 7: Insert/ Update Party Ledger
            // Check if stock already exists for the product and date
            const existingSupplierDetails = await trx(PARTY_LEDGER.NAME)
                .where({
                    [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
                    [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date()
                })
                .first();

            if (existingSupplierDetails) {
                // If stock exists, update the purchase quantity
                await trx(PARTY_LEDGER.NAME)
                    .where({
                        [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
                        [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date()
                    })
                    .update({
                        [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: trx.raw(
                            `${PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT} + ?  - ? `,
                            [grandTotalAmount, existingGrandTotal] // ✅ Single array
                        ),
                        [PARTY_LEDGER.COLUMNS.UPDATED_AT]: new Date()
                    });
                console.log(grandTotalAmount, existingGrandTotal, "total amount")

            } else {
                // If party ledger does not exist, insert a new record
                await trx(PARTY_LEDGER.NAME).insert({
                    [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_ID]: sales_return_mst_id,
                    [PARTY_LEDGER.COLUMNS.PARTY_LEDGER_DETAIL_ID]: body.customer_id,
                    [PARTY_LEDGER.COLUMNS.LEDGER_DATE]: new Date(),
                    [PARTY_LEDGER.COLUMNS.LEDGER_NUMBER]: docno,
                    [PARTY_LEDGER.COLUMNS.LEDGER_TYPE]: "SR",
                    [PARTY_LEDGER.COLUMNS.LEDGER_MODE]: 0,
                    [PARTY_LEDGER.COLUMNS.CHEQUE_NUMBER]: "",
                    [PARTY_LEDGER.COLUMNS.CHEQUE_DATE]: new Date(),
                    [PARTY_LEDGER.COLUMNS.CREDIT_AMOUNT]: body.grand_total,
                    [PARTY_LEDGER.COLUMNS.DEBIT_AMOUNT]: 0,
                    [PARTY_LEDGER.COLUMNS.REMARKS]: body.invoice_no || `Sales Return no (${docno})`,
                    [PARTY_LEDGER.COLUMNS.PAYMENT_TYPE]: 'C',
                    [PARTY_LEDGER.COLUMNS.PL_WH_ID]: body.wh_id || 1,
                    [PARTY_LEDGER.COLUMNS.COMPANY_ID]: body.company_id,
                    [PARTY_LEDGER.COLUMNS.CREATED_AT]: new Date()
                });
            }

            // Commit the transaction
            await trx.commit();
            return { success: true, docno: docno };
        } catch (error) {
            // Rollback transaction in case of error
            // Rollback transaction in case of any failure
            await trx.rollback();
            console.error("Transaction Failed:", error);
            if (error?._code === 404) {
                // Re-throw the custom 404 error as is
                throw error;
            }

            // Default to internal server error if it's not a known custom error
            throw CustomError.create({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Sales Return transaction failed.",
                property: "",
                code: "TRANSACTION_FAILED"
            });
        }
    }

    async function GetAllDirectSales({ params, body, logTrace, userDetails, queryString }) {
        const knex = this;
        const { customer_id } = params;
        const { search, product_id, type_id } = queryString;

        const Productquery = knex(ITEM.NAME)
            .distinctOn(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
            .select(
                `${ITEM.NAME}.*`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID} as customer_id`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE} as customer_type`
            )
            .from(`${ITEM.NAME} as ${ITEM.NAME}`)
            .leftJoin(
                `${CUSTOMER_PRODUCTS_MAPPING.NAME} as ${CUSTOMER_PRODUCTS_MAPPING.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.PRODUCT_ID}`
            )
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`
            )
            .leftJoin(
                `${UNITS.NAME} as ${UNITS.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(`${CUSTOMER_PRODUCTS_MAPPING.NAME}.${CUSTOMER_PRODUCTS_MAPPING.COLUMNS.CUSTOMER_ID}`, customer_id)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.PURCHASE}`, true)
            .where(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
            .orderBy(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, 'asc');


        if (product_id) {
            Productquery.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.ID}`, product_id);
        }
        if (type_id) {
            Productquery.andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.TYPE_ID}`, type_id);
        }
        if (search) {
            Productquery.andWhere(function () {
                this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
                    .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
            });
        }

        const response = await Productquery.paginate({
            pageSize: params.page_size,
            currentPage: params.current_page
        });

        if (!response.data.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Product not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }

    async function GetAllBillWiseSales({ params, body, logTrace, userDetails, queryString }) {
        const knex = this;
        const { from_date, to_date, search, invoice_no, sales_type } = queryString;

        const query = knex
            .select([
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID} as id`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.EINVOICE} as invoice_no`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.SALES_TYPE} as sales_type`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE} as doc_date`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID} as customer_id`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as customer_address`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.QTY} as sale_qty`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.RATE} as sale_rate`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.MRP} as mrp`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.QTY} as a_qty`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.FREE_QTY} as a_free`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.DIS_PER}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.DIS_AMT}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.GST}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.IGST}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.CESS}`
            ])
            .from(`${SALES_FMCG_MASTER.NAME} as ${SALES_FMCG_MASTER.NAME}`)
            .leftJoin(
                `${SALES_FMCG_DETAILS.NAME} as ${SALES_FMCG_DETAILS.NAME}`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.SALES_MASTER_ID}`
            )
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${SALES_FMCG_DETAILS.NAME}.${SALES_FMCG_DETAILS.COLUMNS.PRODID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
            )
            .leftJoin(
                `${UNITS.NAME} as ${UNITS.NAME}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
            )
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.CUSTOMER_ID}`
            )
            .whereRaw(`DATE(${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}) >= ?`, [from_date])
            .whereRaw(`DATE(${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.DOCDATE}) <= ?`, [to_date])
        // .where(`${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.SALES_TYPE}`, sales_type);
        if (search) {
            query.andWhere(function () {
                this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
                    .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
            });
        }

        if (invoice_no) {
            query.andWhere(
                `${SALES_FMCG_MASTER.NAME}.${SALES_FMCG_MASTER.COLUMNS.ID}`, invoice_no
            )
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Sales Return Billwise Details",
            logTrace
        });
        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return Billwise data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const grouped = _.groupBy(response, 'id');


        const updatedResponse = Object.entries(grouped).map(([id, items]) => {
            const { invoice_no, customer_name, customer_address, sales_type, customer_id, doc_date } = items[0];

            return {
                id,
                invoice_no,
                doc_date,
                customer_id,
                customer_name,
                customer_address,
                sales_type,
                items: items.map(item => ({
                    product_id: item.product_id,
                    pro_code: item.pro_code,
                    pro_name: item.pro_name,
                    sale_qty: item.sale_qty,
                    unit_name: item.unit_name,
                    sale_rate: item.sale_rate,
                    mrp: item.mrp,
                    a_qty: item.a_qty,
                    a_free: item.a_free,
                    wh_stock: item.wh_stock,
                    dis_per: item.dis_per,
                    dis_amt: item.dis_amt,
                    gst: item.gst,
                    igst: item.igst,
                    cess: item.cess
                }))
            };
        });

        return {
            data: updatedResponse,
            meta: response.meta
        };

    }

    async function GetAllStoreReturnVerify({ queryString, logTrace }) {
        const knex = this;
        const { from_date, to_date, search, invoice_no, sales_type } = queryString;

        const query = knex
            .select([
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.ID} as id`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.DOC_ID} as doc_no`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.DOC_DATE} as doc_date`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.BILL_NO} as invoice_no`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.FLAG} as flag`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID} as customer_id`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as address_one`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_TWO} as address_two`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.ACCEPT_QTY} as accept_qty`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.WH_STOCK} as wh_qty`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.DE_QTY} as de_qty`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.REJECT_QTY} as r_qty`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as pro_code`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as pro_name`,
                `${ITEM.NAME}.${ITEM.COLUMNS.MRP} as mrp`,
                `${ITEM.NAME}.${ITEM.COLUMNS.SALE_RATE} as sale_rate`,
                `${ITEM.NAME}.${ITEM.COLUMNS.GST} as gst`,
                `${ITEM.NAME}.${ITEM.COLUMNS.CESS} as cess`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,

            ])
            .from(`${STORE_RETURN_FMCG.NAME}`)
            .leftJoin(
                `${ITEM.NAME}`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.PROD_CODE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
            )
            .leftJoin(
                `${UNITS.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .leftJoin(
                `${CUSTOMER.NAME}`,
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.OUTLET_ID}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.LOCATION_ID}`
            )
            .where(`${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.FLAG}`, 1)
        if (from_date && to_date) {
            query.whereBetween(
                `${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.DOC_DATE}`,
                [from_date, to_date]
            );
        }



        if (invoice_no) {
            query.andWhere(`${STORE_RETURN_FMCG.NAME}.${STORE_RETURN_FMCG.COLUMNS.BILL_NO}`, invoice_no);
        }

        if (search) {
            query.andWhere(function () {
                this.where(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`, "ilike", `%${search}%`)
                    .orWhere(`${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`, "ilike", `%${search}%`);
            });
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Store Return Verify",
            logTrace
        });

        const response = await query;

        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Store Return data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        const grouped = _.groupBy(response, 'invoice_no');

        const updatedResponse = Object.entries(grouped).map(([invoice_no, items]) => {
            const {
                id,
                doc_no,
                doc_date,
                customer_id,
                customer_name,
                address_one,
                address_two,
                flag
            } = items[0];

            return {
                id,
                doc_no,
                doc_date,
                invoice_no,
                customer_id,
                customer_name,
                address_one,
                address_two,
                flag,
                items: _.uniqBy(
                    items.map(item => ({
                        product_id: item.product_id,
                        pro_code: item.pro_code,
                        pro_name: item.pro_name,
                        unit_name: item.unit_name,
                        mrp: item.mrp,
                        sale_rate: item.sale_rate,
                        accept_qty: item.accept_qty,
                        wh_qty: item.wh_qty,
                        de_qty: item.de_qty,
                        r_qty: item.r_qty,
                        cess: item.cess,
                        gst: item.gst

                    })),
                    'product_id'
                )

            };
        });


        return {
            data: updatedResponse
        };
    }

    async function generatSalesReturnDocno({ logTrace }) {
        const knex = this;

        const query = knex(SALES_RETURN_MASTER.NAME)
            .returning("id")
            .orderBy(SALES_RETURN_MASTER.COLUMNS.ID, "desc")
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


    async function getAllSalesReturn({ queryString, logTrace, params }) {
        const knex = this;
        const { from_date, to_date, search, sales_return_no } = queryString;

        const query = knex
            .select([
                `${SALES_RETURN_MASTER.NAME}.*`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.SALES_RETURN_TYPE} as return_type`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as customer_address_one`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_TWO} as customer_address_two`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE} as gst_type`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE} as customer_type`
            ])
            .from(`${SALES_RETURN_MASTER.NAME} as ${SALES_RETURN_MASTER.NAME}`)
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID}`
            )

        if (sales_return_no) {
            query.whereRaw(
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.ID} =${sales_return_no}`
            )
        }

        if (from_date) {
            query.whereRaw(
                `DATE(${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.DOCDATE}) >= ?`,
                [from_date]
            );
        }

        if (to_date) {
            query.whereRaw(
                `DATE(${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.DOCDATE}) <= ?`,
                [to_date]
            );
        }

        if (search) {
            query.where(builder =>
                builder
                    .where(`${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.INVOICE_NO}`, 'like', `%${search}%`)
                    .orWhere(`${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME}`, 'like', `%${search}%`)
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get All Sales Return Records with Header and Detail GST Data",
            logTrace
        });

        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return response;
    }



    async function getSalesReturnById({ params, logTrace }) {
        const knex = this;
        const { id } = params;

        // Fetch header
        const headerQuery = knex
            .select([
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.DOCDATE}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.COMPANY_ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.SUB_TOTAL_AMOUNT}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.DISCOUNT}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.REMARK}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.COMPANY_ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.GRAND_TOTAL}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.INVOICE_NO}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.SALES_MASTER_ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.ROUND_OFF}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.SALES_RETURN_TYPE} as return_type `,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.APP_FLAG}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.TOTAL_CESS_AMT}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.TOTAL_GST_AMOUNT}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.TOTAL_IGST_AMOUNT}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME} as customer_name`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_ONE} as customer_address_one`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ADDRESS_TWO} as customer_address_two`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.GST_TYPE} as gst_type`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.CUSTOMER_TYPE} as customer_type`
            ])
            .from(`${SALES_RETURN_MASTER.NAME} as ${SALES_RETURN_MASTER.NAME}`)
            .leftJoin(
                `${CUSTOMER.NAME} as ${CUSTOMER.NAME}`,
                `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
                `${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.CUSTOMER_ID}`
            )
            .where(`${SALES_RETURN_MASTER.NAME}.${SALES_RETURN_MASTER.COLUMNS.ID}`, id) // Explicitly reference the `id` column from `sales_return`
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
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.ID}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.BATCHNO}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.EXP_DATE}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.ACT_QTY}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.RETURN_QTY}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.ACT_FREE}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.RETURN_FREE_QTY}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.DISCOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.RATE}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.RETURN_QTY}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.AMOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.DISCOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.DISCOUNT_AMOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.RATE}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.CGST}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.SGST}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.GST}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.CESS}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.CESS_AMOUNT}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.SALE_TYPE}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.MRP}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.WH_STOCK}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.DNE}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
                `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
                knex.raw(
                    `to_jsonb(${REASON.NAME}.*) as reason`
                ),
            ])
            .from(`${SALES_RETURN_DETAILS.NAME} as ${SALES_RETURN_DETAILS.NAME}`)
            .leftJoin(
                `${ITEM.NAME} as ${ITEM.NAME}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.PRODUCT_ID}`
            )
            .leftJoin(
                `${REASON.NAME} as ${REASON.NAME}`,
                `${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.REASON}`,
                `${REASON.NAME}.${REASON.COLUMNS.ID}`
            )
            .leftJoin(
                `${UNITS.NAME} as ${UNITS.NAME}`,
                `${UNITS.NAME}.${UNITS.COLUMNS.ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`
            )
            .where(`${SALES_RETURN_DETAILS.NAME}.${SALES_RETURN_DETAILS.COLUMNS.SALES_RETURN_ID}`, id); // Same here

        logQuery({
            logger: fastify.log,
            query: detailQuery,
            context: "Get Sales Return Details By Header ID",
            logTrace
        });

        const sales_return_details = await detailQuery;

        if (!sales_return_details.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales Return details not found",
                property: "",
                code: "NOT_FOUND"
            });
        }

        return {
            ...header,
            sales_return_details
        };
    }

    return {
        postSalesReturnRepo,
        putSalesReturnRepo,
        GetAllDirectSales,
        GetAllBillWiseSales,
        generatSalesReturnDocno,
        getAllSalesReturn,
        getSalesReturnById,
        GetAllStoreReturnVerify
    };
}

module.exports = SalesReturnRepo;
