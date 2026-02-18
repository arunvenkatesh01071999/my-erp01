const getSalesService = require("../services/getSalesServices");

function yearSalesHandler(fastify) {
  const getSalesByYear = getSalesService.getSalesByYearService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesByYear({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = yearSalesHandler;
