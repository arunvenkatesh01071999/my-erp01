const getSalesServices = require("../services/getSalesServices");

function monthSalesHandler(fastify) {
  const getSalesByMonth = getSalesServices.getSalesByMonthService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getSalesByMonth({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = monthSalesHandler;
