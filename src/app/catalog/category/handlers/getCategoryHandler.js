const postCategoryService = require("../services/postCategoryService");

function getCategoryHandler(fastify) {
  const getCategory = postCategoryService.getCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getCategory({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCategoryHandler;
