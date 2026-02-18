const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../../errorHandler");
const { logQuery } = require("../../../../commons/helpers");
const { OUTLETSALESMASTER, OUTLETSALESDETAILS } = require("../../../../outlet_sales/outlet_sales_master/commons/constants");
// const { PURCHASE_MST, PURCHASE_DETAILS } = require("../../../../purchase/commons");
const { ITEM } = require("../../../../catalog/commons");



function gstOutletSalesRepo(fastify) {
    async function purchaseGstLedgerOutletSalesReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(PURCHASE_DETAILS.NAME)
            .select(
                `${PURCHASE_DETAILS.NAME}.${PURCHASE_DETAILS.COLUMNS.GST_PER}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum(qty) as qty"),
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
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "Purchase ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }
    async function salesGstLedgerOutletSalesReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(OUTLETSALESDETAILS.NAME)
            .select(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
                knex.raw("sum(rate*qty) as amount"),
                // knex.raw("sum(gst_amt) as gst_amt"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum(qty) as qty"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt")
            )
            .whereBetween(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`
            );
        if (params.outlet_id && params.outlet_id !== 0) {
            query.where(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`,
                params.outlet_id
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get outlet sales ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "outlet Sales ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }
    async function hsnPurchaseGstLedgerOutletSalesReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(PURCHASE_DETAILS.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum(qty) as qty"),
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
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "Purchase ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }
    async function hsnSalesHsnGstLedgerOutletSalesReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(OUTLETSALESDETAILS.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
                knex.raw("sum(rate*qty) as amount"),
                // knex.raw("sum(gst_amt) as gst_amt"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum(qty) as qty"),
                // knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt")
            )
            .join(`${ITEM.NAME} as ${ITEM.NAME}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
            .whereBetween(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                // DOCNO

            );

        if (params.outlet_id && params.outlet_id !== 0) {
            query.where(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`,
                params.outlet_id
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get hsn outlet sales ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "outlet Sales hsn ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }

    async function hsnPurchaseGstLedgerOutletSalesWithDateReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(PURCHASE_DETAILS.NAME)
            .select(
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                knex.raw("sum(rate*qty) as amount"),
                knex.raw("sum(qty) as qty"),
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
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "Purchase ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }
    async function hsnSalesHsnGstLedgerOutletSalesWithDateReport({ body, params, logTrace }) {
        const knex = this;
        const query = knex(OUTLETSALESDETAILS.NAME)
            .select(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,
                knex.raw("sum(rate*qty) as amount"),
                // knex.raw("sum(gst_amt) as gst_amt"),
                knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum(qty) as qty"),
                // knex.raw("sum((rate*qty*gst_per/100)) as gst_amt"),
                knex.raw("sum((rate*qty*igst_per/100)) as igst_amt"),
                knex.raw("sum((rate*qty*cess_per/100)) as cess_amt")
            )
            .join(`${ITEM.NAME} as ${ITEM.NAME}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.PRODID}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.ID}`)
            .whereBetween(`${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`, [body.from_date, body.to_date])
            .groupBy(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCDATE}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.DOCNO}`,
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.GST_PER}`,
                `${ITEM.NAME}.${ITEM.COLUMNS.HSN}`,

            );

        if (Number(params.outlet_id) && Number(params.outlet_id) !== 0) {
            query.where(
                `${OUTLETSALESDETAILS.NAME}.${OUTLETSALESDETAILS.COLUMNS.OUTLETID}`,
                params.outlet_id
            );
        }

        logQuery({
            logger: fastify.log,
            query,
            context: "Get hsn outlet sales ledger",
            logTrace
        });
        const response = await query;
        if (!response.length) {
            // throw CustomError.create({
            //     httpCode: StatusCodes.NOT_FOUND,
            //     message: "outlet Sales hsn ledger data not found",
            //     property: "",
            //     code: "NOT_FOUND"
            // });
        }



        return response;
    }

    return {
        purchaseGstLedgerOutletSalesReport,
        salesGstLedgerOutletSalesReport,
        hsnPurchaseGstLedgerOutletSalesReport,
        hsnSalesHsnGstLedgerOutletSalesReport,
        hsnPurchaseGstLedgerOutletSalesWithDateReport,
        hsnSalesHsnGstLedgerOutletSalesWithDateReport
    };
}

module.exports = gstOutletSalesRepo;