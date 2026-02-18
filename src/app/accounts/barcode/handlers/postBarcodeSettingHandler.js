const barcodeConfigServices = require("../services/barcodeConfigServices");

function postBarcodeSettingHandler(fastify) {
    const postBarcodeConfig = barcodeConfigServices.postBarcodeConfigService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await postBarcodeConfig({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = postBarcodeSettingHandler;
