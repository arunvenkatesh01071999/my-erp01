const barcodeConfigServices = require("../services/barcodeConfigServices");

function deleteBarcodeListHandler(fastify) {
    const deleteBarcodeList = barcodeConfigServices.deleteBarcodeListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await deleteBarcodeList({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deleteBarcodeListHandler;