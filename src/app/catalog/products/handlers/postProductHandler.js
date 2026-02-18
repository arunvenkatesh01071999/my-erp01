const productServices = require("../services/productServices");

function postProductHandler(fastify) {
  const postProduct = productServices.postProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await postProduct({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = postProductHandler;
