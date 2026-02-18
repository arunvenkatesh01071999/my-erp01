const postSubCategoryService = require("../services/postSubCategoryService");

function getSubCategoryHandler(fastify) {
  const getSubCategory = postSubCategoryService.getSubCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getSubCategory({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSubCategoryHandler;
