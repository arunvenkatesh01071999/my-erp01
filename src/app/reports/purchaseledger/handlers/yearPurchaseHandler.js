const getPurchaseService = require("../services/getPurchaseServices");

function yearPurchaseHandler(fastify) {
  const getPurchaseByYear = getPurchaseService.getPurchaseByYearService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getPurchaseByYear({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = yearPurchaseHandler;
