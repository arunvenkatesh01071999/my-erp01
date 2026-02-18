const inchargeGroupMasterServices = require("../services/inchargeGroupMasterServices");

function getInchargeGroupMasterPaginateHandler(fastify) {
  const getInchargeGroupMasterPaginate = inchargeGroupMasterServices.getInchargeGroupMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getInchargeGroupMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getInchargeGroupMasterPaginateHandler;
