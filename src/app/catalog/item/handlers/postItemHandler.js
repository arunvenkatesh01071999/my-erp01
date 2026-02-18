const ItemServices = require("../services/itemServices");

function postItemHandler(fastify) {
  const postItem = ItemServices.postItemService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace,userDetails } = request;
    const response = await postItem({ params, body, logTrace,userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postItemHandler;
