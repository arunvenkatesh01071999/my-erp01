const inchargeGroupMasterServices = require("../services/inchargeGroupMasterServices");

function getTypedesignHandler(fastify) {
  const getInchargeGroupMaster = inchargeGroupMasterServices.getInchargeGroupMasterService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getInchargeGroupMaster({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTypedesignHandler;
