const fmcgBatchUpdate = require("../repository/fmcgBatchUpdate");


function postBatchUpdateService(fastify) {

    const { UpdatePurchaseBatchDetails } = fmcgBatchUpdate(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await UpdatePurchaseBatchDetails.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
        });

        return response;
    };
}


function GetFmcgProductListService(fastify) {

    const { getfmcgProductList } = fmcgBatchUpdate(fastify);

    return async ({ body, params, logTrace, userDetails }) => {
        const knex = fastify.knexMedical;
        const response = await getfmcgProductList.call(knex, {
            params,
            body,
            logTrace,
            userDetails,
        });

        return response;
    };
}

module.exports = {
    postBatchUpdateService,
    GetFmcgProductListService
};
