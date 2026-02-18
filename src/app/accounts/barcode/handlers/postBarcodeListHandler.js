const barcodeConfigServices = require("../services/barcodeConfigServices");

function postBarcodeListHandler(fastify) {
    const postBarcodeList = barcodeConfigServices.postBarcodeListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postBarcodeList({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postBarcodeListHandler;