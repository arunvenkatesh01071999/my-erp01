const postCategoryServices = require("../services/postCategoryService");

function postCategoryHandler(fastify) {
  const postCategory = postCategoryServices.postCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postCategoryHandler;
