const postSubCategoryService = require("../services/postSubCategoryService");

function putSubCategoryHandler(fastify) {
  const putSubCategory = postSubCategoryService.putSubCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putSubCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putSubCategoryHandler;
