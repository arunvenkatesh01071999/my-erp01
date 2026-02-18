const OutletMemberServices = require("../services/OutletMemberService");

function getOutletMemberHandler(fastify) {
  const getOutletMember = OutletMemberServices.getOutletMemberService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOutletMember({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemberHandler;
