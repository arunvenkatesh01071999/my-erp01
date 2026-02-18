const syncfetchService = require("../services/syncfetchService");

function getMerchantCategoryDetailsHandler(fastify) {
    const getMerchantCategoryDetails = syncfetchService.getMerchantCategoryDetailsService(fastify);

    return async (request, replay) => {
        const { params, logTarce, body, query } = request;
        const response = await getMerchantCategoryDetails({
            params,
            logTarce,
            body,
            query
        });
        return replay.code(200).send(response);
    }
}

module.exports = getMerchantCategoryDetailsHandler;