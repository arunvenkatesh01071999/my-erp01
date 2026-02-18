const wareHouseServices = require("../services/wareHouseServices");

function postWhereHouseHandler(fastify) {
  const postWhereHouse = wareHouseServices.postWareHouseService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postWhereHouse({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postWhereHouseHandler;
