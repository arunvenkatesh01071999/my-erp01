const merchantcategoryService = require("../services/merchantcategoryService");

function getMerchantCategoryInfoHandler(fastify) {
  const getMerchantCategoryInfo = merchantcategoryService.getMerchantCategoryInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getMerchantCategoryInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getMerchantCategoryInfoHandler;
