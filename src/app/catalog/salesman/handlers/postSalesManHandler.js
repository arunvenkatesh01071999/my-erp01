const SalesManServices = require("../services/salesManServices");

function postSalesManHandler(fastify) {
  const postSalesMan = SalesManServices.postSalesManService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails, files } = request;
    const response = await postSalesMan({ params, body, logTrace, userDetails, files });
    return reply.code(200).send(response);
  };
}

module.exports = postSalesManHandler;
