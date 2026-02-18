const getOutletSalesService = require("../services/getOutletSalesServices");

function yearOutletSalesHandler(fastify) {
  const getOutletSalesByYear = getOutletSalesService.getOutletSalesByYearService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOutletSalesByYear({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = yearOutletSalesHandler;
