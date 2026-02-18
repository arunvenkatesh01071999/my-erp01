const getPayTypeMasterService = require("../services/getPayTypeMasterService");

function deletePayTypeMasterHandler(fastify) {
  const PayTypeMaster = getPayTypeMasterService.deletePayTypeMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await PayTypeMaster({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deletePayTypeMasterHandler;
