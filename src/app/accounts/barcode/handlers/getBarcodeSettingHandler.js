const barcodeConfigServices = require("../services/barcodeConfigServices");

function getBarcodeSettingHandler(fastify) {
    const getBarcodeConfig = barcodeConfigServices.getBarcodeConfigService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getBarcodeConfig({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getBarcodeSettingHandler;
