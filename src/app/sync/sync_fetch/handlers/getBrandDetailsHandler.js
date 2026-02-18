const syncfetchService = require("../services/syncfetchService");

function getBrandDetailsHandler(fastify) {
    const getBrandDetails = syncfetchService.getBrandsSyncDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, query, params } = request;
        const response = await getBrandDetails({
            userDetails,
            query,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getBrandDetailsHandler;