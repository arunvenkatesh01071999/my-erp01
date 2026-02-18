const outletServices = require("../services/outletServices");

function postOutletHandler(fastify) {
  const postOutlet = outletServices.postOutletService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOutlet({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOutletHandler;
