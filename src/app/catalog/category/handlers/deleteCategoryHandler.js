const postCategoryServices = require("../services/postCategoryService");

function deleteCategoryHandler(fastify) {
  const deleteCategory = postCategoryServices.deleteCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteCategoryHandler;
