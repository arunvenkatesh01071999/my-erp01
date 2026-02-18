const salesmarginService = require("../services/salesmarginService");

function getSaleMarginHandler(fastify) {
  const getSaleMargin = salesmarginService.getSalesMarginService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getSaleMargin({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSaleMarginHandler;
