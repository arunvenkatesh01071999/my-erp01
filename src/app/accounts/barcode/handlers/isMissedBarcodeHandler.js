const barcodeConfigServices = require("../services/barcodeConfigServices");

function isMissedBarcodeHandler(fastify) {
    const isMissedBarcode = barcodeConfigServices.isMissedBarcodeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await isMissedBarcode({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = isMissedBarcodeHandler;
