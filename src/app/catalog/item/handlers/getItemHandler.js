const itemServices = require("../services/itemServices");

function getItemHandler(fastify) {
  const getItem = itemServices.getItemService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getItem({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getItemHandler;
