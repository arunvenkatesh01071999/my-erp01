const postCategoryService = require("../services/postCategoryService");

function getCategoryInfoHandler(fastify) {
  const getCategoryInfo = postCategoryService.getCategoryInfoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getCategoryInfo({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCategoryInfoHandler;
