const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function getPoSettingHandler(fastify) {
    const getPoSetting = purchaseOrderServices.getPoSettingService(fastify);

    return async (request, reply) => {
        const { body, params, logTrace, userDetails } = request;
        const response = await getPoSetting({ body, params, logTrace, userDetails });
        return reply.code(200).send(response);
    };
}

module.exports = getPoSettingHandler;
