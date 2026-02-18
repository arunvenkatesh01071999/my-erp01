const getOutletSalesServices = require("../services/getOutletSalesServices");

function monthOutletSalesHandler(fastify) {
  const getSalesByMonth = getOutletSalesServices.getOutletSalesByMonthService(fastify);
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

module.exports = monthOutletSalesHandler;
