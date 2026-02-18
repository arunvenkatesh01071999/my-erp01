const barcodeConfigServices = require("../services/barcodeConfigServices");

function postBarcodeCheckHandler(fastify) {
    const postBarcodeCheck = barcodeConfigServices.postBarcodeCheckService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postBarcodeCheck({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postBarcodeCheckHandler;
