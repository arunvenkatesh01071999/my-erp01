const consumerServices = require("../services/consumerServices");

function getConsumerPaginateHandler(fastify) {
  const getConsumerPaginate = consumerServices.getConsumerPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getConsumerPaginate({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getConsumerPaginateHandler;
