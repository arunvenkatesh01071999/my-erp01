const merchantcategoryService = require("../services/merchantcategoryService");

function putMerchantCategoryHandler(fastify) {
  const putMerchantCategory = merchantcategoryService.putMerchantCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putMerchantCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putMerchantCategoryHandler;
