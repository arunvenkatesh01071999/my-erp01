const productServices = require("../services/productServices");

function getProductDetailHandler(fastify) {
  const getProductDetail = productServices.getProductDetailService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getProductDetail({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getProductDetailHandler;
