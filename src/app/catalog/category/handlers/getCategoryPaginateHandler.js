const postCategoryService = require("../services/postCategoryService");

function getCategoryPaginateHandler(fastify) {
  const getCategoryPaginate =
    postCategoryService.getCategoryPaginateService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getCategoryPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getCategoryPaginateHandler;
