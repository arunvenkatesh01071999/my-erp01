const barcodeConfigServices = require("../services/barcodeConfigServices");

function getBarcodeListHandler(fastify) {
    const getBarcodeList = barcodeConfigServices.getBarcodeListService(fastify);
    return async (request, reply) => {
        const { body, params, query, logTrace, userDetails } = request;
        const response = await getBarcodeList({ body, params, query, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getBarcodeListHandler;
