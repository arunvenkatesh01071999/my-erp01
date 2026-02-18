const salesmarginService = require("../services/salesmarginService");

function postSalesMarginHandler(fastify) {
  const postSalesMargin = salesmarginService.postSalesMarginService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postSalesMargin({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postSalesMarginHandler;
