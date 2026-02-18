const accountMasterServices = require("../services/accountMaster");

function getConsumerInfoHandler(fastify) {
  const getaccountMaster = accountMasterServices.getAccountMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getaccountMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getConsumerInfoHandler;
