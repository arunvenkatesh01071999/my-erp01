const getOrderService = require("../services/getOrderServices");

function orderItemsSalesHandler(fastify) {
  const getItemsSales = getOrderService.getItemsSalesService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getItemsSales({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = orderItemsSalesHandler;
