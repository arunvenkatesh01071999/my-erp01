const barcodeConfigServices = require("../services/barcodeConfigServices");

function iscloseBarcodeHandler(fastify) {
    const iscloseBarcode = barcodeConfigServices.iscloseBarcodeService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await iscloseBarcode({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = iscloseBarcodeHandler;
