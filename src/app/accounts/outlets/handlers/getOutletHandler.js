const outletServices = require("../services/outletServices");

function getOutletHandler(fastify) {
  const getOutlet = outletServices.getOutletService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOutlet({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletHandler;
