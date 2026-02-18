const barcodeConfigServices = require("../services/barcodeConfigServices");

function getBarcodeListAginstPurchaseHandler(fastify) {
    const getBarcodeListAginstPurchase = barcodeConfigServices.getBarcodeListAginstPurchaseService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getBarcodeListAginstPurchase({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getBarcodeListAginstPurchaseHandler;
