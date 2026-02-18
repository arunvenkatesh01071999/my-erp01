const syncfetchService = require("../services/syncfetchService");

function getCategoryDetailsHandler(fastify) {
    const getCategoryDetails = syncfetchService.getCategoryDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, query, params } = request;
        const response = await getCategoryDetails({
            userDetails,
            query,
            params
        });
        return replay.code(200).send(response);
    }
}

module.exports = getCategoryDetailsHandler;