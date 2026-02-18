const wareHouseServices = require("../services/wareHouseServices");

function getWareHousePaginateHandler(fastify) {
  const getWareHousePaginate = wareHouseServices.getWareHousePaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getWareHousePaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getWareHousePaginateHandler;
