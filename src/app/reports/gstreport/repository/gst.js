const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SALESMASTER, SALESDETAILS } = require("../../../sales/commons");
// const { PURCHASE_MST, PURCHASE_DETAILS } = require("../../../purchase/commons");
const { ITEM } = require("../../../catalog/commons");


function gstRepo(fastify) {
    async function purchaseGstLedgerReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(PURCHASE_DETAILS.NAME)
            .select(
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.GST_PER}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt"),
            )
            .whereBetween(`${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.GST_PER}`
            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase ledger data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }



        return response;
    }
    async function salesGstLedgerReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(SALESDETAILS.NAME)
            .select(
                `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt")
            )
            .whereBetween(`${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`
            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get sales ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales ledger data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }



        return response;
    }
    async function hsnPurchaseGstLedgerReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(PURCHASE_DETAILS.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt"),
            )
            .join(`${ITEM.NAME} as ${ITEM.NAME}`,
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.PROD_ID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
            .whereBetween(`${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                // `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.GST_PER}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get Purchase Hsn Ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Purchase ledger data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }



        return response;
    }
    async function hsnSalesHsnGstLedgerReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(SALESDETAILS.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt")
            )
            .join(`${ITEM.NAME} as ${ITEM.NAME}`,
                `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.PRODID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
            .whereBetween(`${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                // `${SALESDETAILS.NAME}.${SALESDETAILS.COLUMNS.GST_PER}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`

            );

        logQuery({
            logger: fastify.log,
            query,
            context: "Get hsn sales ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            throw CustomError.create({
                httpCode: StatusCodes.NOT_FOUND,
                message: "Sales hsn ledger data not found",
                property: "",
                code: "NOT_FOUND"
            });
        }



        return response;
    }

    return {
        purchaseGstLedgerReport,
        salesGstLedgerReport,
        hsnPurchaseGstLedgerReport,
        hsnSalesHsnGstLedgerReport
    };
}

module.exports = gstRepo;
