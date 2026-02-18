const SalesManServices = require("../services/salesManServices");

function deleteSalesManHandler(fastify) {
  const deleteSalesMan = SalesManServices.deleteSalesManService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteSalesMan({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSalesManHandler;
