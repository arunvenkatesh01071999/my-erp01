const barcodeConfigServices = require("../services/barcodeConfigServices");

function generateBarcodeHandler(fastify) {
    const generateBarcode = barcodeConfigServices.generateBarcodeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await generateBarcode({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = generateBarcodeHandler;
