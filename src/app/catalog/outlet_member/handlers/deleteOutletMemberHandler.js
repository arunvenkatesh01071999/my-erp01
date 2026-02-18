const OutletMemberServices = require("../services/OutletMemberService");

function deleteOutletMemberHandler(fastify) {
  const deleteOutletMember = OutletMemberServices.deleteOutletMemberService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteOutletMember({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOutletMemberHandler;
