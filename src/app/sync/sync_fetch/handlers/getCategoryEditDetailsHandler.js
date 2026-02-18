const syncfetchService = require("../services/syncfetchService");

function getCategoryEditDetailsHandler(fastify) {
    const getCategoryEditDetails = syncfetchService.getCategoryEditDetailsService(fastify);

    return async (request, replay) => {
        const { userDetails, params } = request;
        const response = await getCategoryEditDetails({
            params,
            userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = getCategoryEditDetailsHandler;