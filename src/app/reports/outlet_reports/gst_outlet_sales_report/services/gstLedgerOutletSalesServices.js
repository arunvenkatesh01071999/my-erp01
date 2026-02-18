const gstOutletSalesRepo = require("../repository/gstOutletSales.js");

function gstLedgerReportOutletSalesService(fastify) {
    const { purchaseGstLedgerOutletSalesReport, salesGstLedgerOutletSalesReport } = gstOutletSalesRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = await purchaseGstLedgerOutletSalesReport.call(knex, {
            body,
            params,
            logTrace
        });
        const promise2 = await salesGstLedgerOutletSalesReport.call(knex, {
            body,
            params,
            logTrace
        });

        const [
            purchase,
            outlet_sales
        ] = await Promise.all([
            promise1,
            promise2

        ]);
        return {
            purchase: purchase,
            outlet_sales: outlet_sales
        };
    };
}
function hsnGstLedgerReportOutletSalesService(fastify) {
    const { hsnPurchaseGstLedgerOutletSalesReport, hsnSalesHsnGstLedgerOutletSalesReport } = gstOutletSalesRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = await hsnPurchaseGstLedgerOutletSalesReport.call(knex, {
            body,
            params,
            logTrace
        });
        const promise2 = await hsnSalesHsnGstLedgerOutletSalesReport.call(knex, {
            body,
            params,
            logTrace
        });

        const [
            purchase,
            outlet_sales
        ] = await Promise.all([
            promise1,
            promise2

        ]);
        return {
            purchase: purchase,
            outlet_sales: outlet_sales
        };
    };
}

function hsnGstLedgerReportOutletSalesWithDateService(fastify) {
    const { hsnPurchaseGstLedgerOutletSalesWithDateReport, hsnSalesHsnGstLedgerOutletSalesWithDateReport } = gstOutletSalesRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = await hsnPurchaseGstLedgerOutletSalesWithDateReport.call(knex, {
            body,
            params,
            logTrace
        });
        const promise2 = await hsnSalesHsnGstLedgerOutletSalesWithDateReport.call(knex, {
            body,
            params,
            logTrace
        });

        const [
            purchase,
            outlet_sales
        ] = await Promise.all([
            promise1,
            promise2

        ]);
        return {
            purchase: purchase,
            outlet_sales: outlet_sales
        };
    };
}

module.exports = {
    gstLedgerReportOutletSalesService,
    hsnGstLedgerReportOutletSalesService,
    hsnGstLedgerReportOutletSalesWithDateService
};
