const salesmarginService = require("../services/salesmarginService");

function getSaleMarginNewDetailsHandler(fastify) {
  const getSaleMarginNewDetails = salesmarginService.getSalesMarginNewService(fastify);
  return async (request, reply) => {
    const { body, params, query, logTrace } = request;
    const response = await getSaleMarginNewDetails({ body, params, query, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSaleMarginNewDetailsHandler;
