const patchCategoryImageService = require("../services/patchCategoryImage");

function patchCategoryImageHandler(fastify) {
  const patchCategoryImage = patchCategoryImageService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await patchCategoryImage({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = patchCategoryImageHandler;
