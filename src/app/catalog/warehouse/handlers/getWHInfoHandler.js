const wareHouseServices = require("../services/wareHouseServices");

function getWareHouseInfoHandler(fastify) {
  const getWareHouseInfo = wareHouseServices.getWareHouseInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getWareHouseInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getWareHouseInfoHandler;
