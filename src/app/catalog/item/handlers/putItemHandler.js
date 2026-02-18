const itemServices = require("../services/itemServices");

function putItemHandler(fastify) {
  const putItem = itemServices.putItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await putItem({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putItemHandler;
