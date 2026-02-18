const postSubCategoryService = require("../services/postSubCategoryService");

function getSubCategoryInfoHandler(fastify) {
  const getSubCategoryInfo =
    postSubCategoryService.getSubCategoryInfoService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getSubCategoryInfo({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getSubCategoryInfoHandler;
