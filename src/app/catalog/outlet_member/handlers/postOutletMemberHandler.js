const OutletMemberServices = require("../services/OutletMemberService");

function postOutletMemberHandler(fastify) {
  const postOutletMember = OutletMemberServices.postOutletMemberService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutletMember({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletMemberHandler;
