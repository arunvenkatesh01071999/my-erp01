const getOrderService = require("../services/getOrderServices");

function getOrderByDatePaginateHandler(fastify) {
  const getOrderPaginateByDate =
    getOrderService.getOrderPaginateByDateService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrderPaginateByDate({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOrderByDatePaginateHandler;
