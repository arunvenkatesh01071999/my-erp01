const merchantcategoryService = require("../services/merchantcategoryService");

function postMerchantCategoryHandler(fastify) {
  const postInchargeMaster = merchantcategoryService.postMerchantCategoryService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postInchargeMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postMerchantCategoryHandler;
