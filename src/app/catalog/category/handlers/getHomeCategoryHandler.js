const postCategoryService = require("../services/postCategoryService");

function getHomeCategoryHandler(fastify) {
  const getHomeCategory = postCategoryService.getHomeCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getHomeCategory({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getHomeCategoryHandler;
