const inchargeGroupMasterServices = require("../services/inchargeGroupMasterServices");

function putInchargeGroupMasterHandler(fastify) {
  const putInchargeGroupMaster = inchargeGroupMasterServices.putInchargeGroupMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putInchargeGroupMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putInchargeGroupMasterHandler;
