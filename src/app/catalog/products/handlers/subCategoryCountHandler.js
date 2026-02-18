const productServices = require("../services/productServices");

function subCategoryCountHandler(fastify) {
  const getSubCategoryCount = productServices.subCategoryCountService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace } = request;
    const response = await getSubCategoryCount({ params, body, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = subCategoryCountHandler;
