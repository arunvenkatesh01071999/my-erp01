const wareHouseServices = require("../services/wareHouseServices");

function putWareHouseHandler(fastify) {
  const putWareHouse = wareHouseServices.putWareHouseService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putWareHouse({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putWareHouseHandler;
