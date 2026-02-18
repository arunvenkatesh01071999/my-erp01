const postSubCategoryServices = require("../services/postSubCategoryService");

function postSubCategoryHandler(fastify) {
  const postSubCategory =
    postSubCategoryServices.postSubCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postSubCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postSubCategoryHandler;
