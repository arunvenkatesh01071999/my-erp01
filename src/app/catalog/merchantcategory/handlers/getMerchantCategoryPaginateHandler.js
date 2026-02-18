const merchantcategoryService = require("../services/merchantcategoryService");

function getMerchantCategoryPaginateHandler(fastify) {
  const getMerchantCategoryPaginate = merchantcategoryService.getMerchantCategoryPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getMerchantCategoryPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getMerchantCategoryPaginateHandler;
