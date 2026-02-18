const itemServices = require("../services/itemServices");

function getItemCodeHandler(fastify) {
  const getItemInfo = itemServices.getItemCodeService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getItemInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getItemCodeHandler;
