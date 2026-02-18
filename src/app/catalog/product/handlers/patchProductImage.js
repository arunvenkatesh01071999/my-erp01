const patchProductImageService = require("../services/patchProductImage");

function patchProductImageHandler(fastify) {
  const patchProductImage = patchProductImageService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await patchProductImage({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = patchProductImageHandler;
