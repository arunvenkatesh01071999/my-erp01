const purchaseOrderServices = require("../services/fmcgPurchaseOrderServices.js");

function putPoSettingHandler(fastify) {
  const putPoSetting = purchaseOrderServices.putPoSettingService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putPoSetting({ body, params, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putPoSettingHandler;
