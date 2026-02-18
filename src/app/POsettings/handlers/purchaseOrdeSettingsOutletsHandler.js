const poSettingServices = require("../services/getPoSettinigsServices");

function purchaseOrdeSettingsOutletsHandler(fastify) {
    const purchaseOrdeSettingsOutlets = poSettingServices.purchaseOrdeSettingsOutletsService(fastify);
    return async (request, reply) => {
        const { body, params, logTrace } = request;
        const response = await purchaseOrdeSettingsOutlets({ body, params, logTrace });
        return reply.code(200).send(response);
    };
}

module.exports = purchaseOrdeSettingsOutletsHandler;
