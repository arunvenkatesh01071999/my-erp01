const outletServices = require("../services/outletServices");

function deleteOutletHandler(fastify) {
  const deleteOutlet = outletServices.deleteOutletService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteOutlet({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOutletHandler;
