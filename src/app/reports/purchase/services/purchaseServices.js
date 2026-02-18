const purchaseRepo = require("../repository/purchase.js");

function getPurchaseReportService(fastify) {
    const { getPurchaseReport } = purchaseRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getPurchaseReport.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}

function deletePurchaseReportService(fastify) {
    const { deletePurchaseReport } = purchaseRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await deletePurchaseReport.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}
function getPurchaseReturnReportService(fastify) {
    const { getPurchaseReturnReport } = purchaseRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await getPurchaseReturnReport.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}

module.exports = {
    getPurchaseReportService,
    deletePurchaseReportService,
    getPurchaseReturnReportService
};
