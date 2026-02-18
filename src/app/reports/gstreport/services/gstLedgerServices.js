const gstRepo = require("../repository/gst.js");

function gstLedgerReportService(fastify) {
    const { purchaseGstLedgerReport, salesGstLedgerReport } = gstRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = await purchaseGstLedgerReport.call(knex, {
            body,
            params,
            logTrace
        });
        const promise2 = await salesGstLedgerReport.call(knex, {
            body,
            params,
            logTrace
        });

        const [
            purchase,
            sales
        ] = await Promise.all([
            promise1,
            promise2

        ]);
        return {
            purchase: purchase,
            sales: sales
        };
    };
}
function hsnGstLedgerReportService(fastify) {
    const { hsnPurchaseGstLedgerReport, hsnSalesHsnGstLedgerReport } = gstRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const promise1 = await hsnPurchaseGstLedgerReport.call(knex, {
            body,
            params,
            logTrace
        });
        const promise2 = await hsnSalesHsnGstLedgerReport.call(knex, {
            body,
            params,
            logTrace
        });

        const [
            purchase,
            sales
        ] = await Promise.all([
            promise1,
            promise2

        ]);
        return {
            purchase: purchase,
            sales: sales
        };
    };
}


module.exports = {
    gstLedgerReportService,
    hsnGstLedgerReportService
};
