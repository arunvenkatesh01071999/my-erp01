const postCategoryService = require("../services/postCategoryService");

function putCategoryHandler(fastify) {
  const putCategory = postCategoryService.putCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putCategoryHandler;
