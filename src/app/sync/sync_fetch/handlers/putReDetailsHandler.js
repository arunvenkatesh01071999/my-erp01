const syncfetchService = require("../services/syncfetchService");

function putReDetailsHandler(fastify) {
    const putReDetailsService = syncfetchService.putReDetailsService(fastify);

    return async (request, replay) => {
        const { params, body, query, logTrace, userDetails } = request;
        const response = await putReDetailsService({
            params, body, query, logTrace, userDetails
        });
        return replay.code(200).send(response);
    }
}

module.exports = putReDetailsHandler;