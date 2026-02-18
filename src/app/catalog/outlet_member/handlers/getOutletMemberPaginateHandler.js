const OutletMemberServices = require("../services/OutletMemberService");

function getOutletMemberPaginateHandler(fastify) {
  const getOutletMemberPaginate = OutletMemberServices.getOutletMemberPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOutletMemberPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemberPaginateHandler;
