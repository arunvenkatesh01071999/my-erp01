const productServices = require("../services/productServices");

function getProductByCategoryHandler(fastify) {
  const getProductByCategory =
    productServices.getProductByCategoryService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getProductByCategory({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getProductByCategoryHandler;
