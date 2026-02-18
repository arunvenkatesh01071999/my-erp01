const productServices = require("../services/productServices");

function deleteProductHandler(fastify) {
  const deleteProduct = productServices.deleteProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await deleteProduct({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = deleteProductHandler;
