const wareHouseServices = require("../services/wareHouseServices");

function getWareHouseHandler(fastify) {
  const getWareHouse = wareHouseServices.getWareHouseService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getWareHouse({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getWareHouseHandler;
