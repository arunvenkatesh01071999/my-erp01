const merchantcategoryService = require("../services/merchantcategoryService");

function getMerchantCategoryHandler(fastify) {
  const getMerchantCategory = merchantcategoryService.getMerchantCategoryService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getMerchantCategory({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getMerchantCategoryHandler;
