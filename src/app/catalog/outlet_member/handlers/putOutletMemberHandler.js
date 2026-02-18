const OutletMemberServices = require("../services/OutletMemberService");

function putOutletMemberHandler(fastify) {
  const putOutletMember = OutletMemberServices.putOutletMemberService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutletMember({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletMemberHandler;
