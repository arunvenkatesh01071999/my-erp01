const ItemServices = require("../services/itemServices");

function getItemParentListHandler(fastify) {
  const getItemParentList = ItemServices.getItemParentService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getItemParentList({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getItemParentListHandler;
