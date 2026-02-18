const itemServices = require("../services/itemServices");

function deleteItemHandler(fastify) {
  const deleteItem = itemServices.deleteItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteItem({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteItemHandler;
