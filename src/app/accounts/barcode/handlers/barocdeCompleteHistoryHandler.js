const barcodeConfigServices = require("../services/barcodeConfigServices");

function barocdeCompleteHistoryHandler(fastify) {
    const barcodeCompleteHistory = barcodeConfigServices.barcodeCompleteHistoryService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await barcodeCompleteHistory({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = barocdeCompleteHistoryHandler;
