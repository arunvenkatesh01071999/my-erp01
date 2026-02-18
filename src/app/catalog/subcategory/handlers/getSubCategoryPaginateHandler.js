const postSubCategoryService = require("../services/postSubCategoryService");

function getSubCategoryPaginateHandler(fastify) {
  const getSubCategoryPaginate =
    postSubCategoryService.getSubCategoryPaginateService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, query } = request;
    const response = await getSubCategoryPaginate({ params, body, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getSubCategoryPaginateHandler;
