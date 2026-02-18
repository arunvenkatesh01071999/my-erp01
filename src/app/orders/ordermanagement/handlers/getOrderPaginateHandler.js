const getOrderService = require("../services/getOrderServices");

function getOrderPaginateHandler(fastify) {
  const getOrderPaginate = getOrderService.getOrderPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace, userDetails } = request;
    const response = await getOrderPaginate({
      body,
      params,
      query,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOrderPaginateHandler;
