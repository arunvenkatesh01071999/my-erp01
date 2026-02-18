const inchargeGroupMasterServices = require("../services/inchargeGroupMasterServices");

function deleteInchargeGroupMasterHandler(fastify) {
  const deleteInchargeGroupMaster = inchargeGroupMasterServices.deleteInchargeGroupMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteInchargeGroupMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteInchargeGroupMasterHandler;
