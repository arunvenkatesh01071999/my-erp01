const productServices = require("../services/productServices");

function getProductByBrandHandler(fastify) {
  const getProductByBrand = productServices.getProductByBrandService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getProductByBrand({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getProductByBrandHandler;
