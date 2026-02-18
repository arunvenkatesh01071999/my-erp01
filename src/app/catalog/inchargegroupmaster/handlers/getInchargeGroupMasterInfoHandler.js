const inchargeGroupMasterServices = require("../services/inchargeGroupMasterServices");

function getInchargeGroupMasterInfoHandler(fastify) {
  const getInchargeGroupMasterInfo = inchargeGroupMasterServices.getInchargeGroupMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getInchargeGroupMasterInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getInchargeGroupMasterInfoHandler;
