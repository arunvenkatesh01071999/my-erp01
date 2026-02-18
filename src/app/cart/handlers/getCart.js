const getCartService = require("../services/getCart");

function getCartHandler(fastify) {
  const getCart = getCartService(fastify);
  return async (request, reply) => {
    const { query, logTrace, userDetails } = request;
    const response = await getCart({ query, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = getCartHandler;
