const productServices = require("../services/productServices");

function putProductHandler(fastify) {
  const putProduct = productServices.putProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await putProduct({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = putProductHandler;
