const wareHouseServices = require("../services/wareHouseServices");

function deleteWareHouseHandler(fastify) {
  const deleteWareHouse = wareHouseServices.deleteWareHouseService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteWareHouse({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteWareHouseHandler;
