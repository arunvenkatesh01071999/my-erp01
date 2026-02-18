const getPurchaseServices = require("../services/getPurchaseServices");

function monthPurchaseHandler(fastify) {
  const getPurchaseByMonth = getPurchaseServices.getPurchaseByMonthService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getPurchaseByMonth({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = monthPurchaseHandler;
