const productServices = require("../services/productServices");

function priceByVariantsHandler(fastify) {
  const { getPriceSingleProduct } = productServices.getPriceService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getPriceSingleProduct({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = priceByVariantsHandler;
