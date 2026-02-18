const barcodeConfigServices = require("../services/barcodeConfigServices");

function deactivateBarcodeHandler(fastify) {
    const deactivateBarcode = barcodeConfigServices.deactivateBarcodeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await deactivateBarcode({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = deactivateBarcodeHandler;
