const postSubCategoryService = require("../services/postSubCategoryService");

function getCategorySubCategoryInfoHandler(fastify) {
  const getCategorySubCategoryInfo =
    postSubCategoryService.getCategorySubCategoryInfoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getCategorySubCategoryInfo({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getCategorySubCategoryInfoHandler;
