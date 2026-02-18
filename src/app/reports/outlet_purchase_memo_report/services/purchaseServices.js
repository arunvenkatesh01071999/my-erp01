const purchaseRepo = require("../repository/purchaseRepo.js");


function purchaseOrderOutletsService(fastify) {
    const { purchaseOrderOutletsRepo } = purchaseRepo(fastify);

    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await purchaseOrderOutletsRepo.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}

function purchaseOrderRegionsService(fastify) {
    const { purchaseOrderRegionsRepo } = purchaseRepo(fastify);
    return async ({ body, params, logTrace }) => {
        const knex = fastify.knexMedical;
        const response = await purchaseOrderRegionsRepo.call(knex, {
            body,
            params,
            logTrace
        });
        return response;
    };
}



module.exports = {
    purchaseOrderOutletsService,
    purchaseOrderRegionsService
};
