const productServices = require("../services/productServices");

function getProductBySubCategoryHandler(fastify) {
  const getProductBySubCategory =
    productServices.getProductBySubCategoryService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getProductBySubCategory({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getProductBySubCategoryHandler;
