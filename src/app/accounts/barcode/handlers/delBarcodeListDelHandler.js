const barcodeConfigServices = require("../services/barcodeConfigServices");

function delBarcodeListHandler(fastify) {
    const delBarcodeList = barcodeConfigServices.delBarcodeListService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await delBarcodeList({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = delBarcodeListHandler;