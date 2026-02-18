const productServices = require("../services/productServices");

function getProductHandler(fastify) {
  const getProduct = productServices.getProductService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getProduct({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getProductHandler;
