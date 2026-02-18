const postSubCategoryServices = require("../services/postSubCategoryService");

function deleteSubCategoryHandler(fastify) {
  const deleteSubCategory =
    postSubCategoryServices.deleteSubCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteSubCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteSubCategoryHandler;
