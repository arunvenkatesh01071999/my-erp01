const merchantcategoryService = require("../services/merchantcategoryService");

function deleteMerchantCategoryHandler(fastify) {
  const deleteMerchantCategory = merchantcategoryService.deleteMerchantCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteMerchantCategory({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteMerchantCategoryHandler;
