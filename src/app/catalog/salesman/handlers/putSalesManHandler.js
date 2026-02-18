const SalesManServices = require("../services/salesManServices");

function putSalesManHandler(fastify) {
  const putSalesMan = SalesManServices.putSalesManService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putSalesMan({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putSalesManHandler;
