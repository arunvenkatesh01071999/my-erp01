const outletServices = require("../services/outletServices");

function putOutletHandler(fastify) {
  const putOutlet = outletServices.putOutletService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOutlet({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletHandler;
