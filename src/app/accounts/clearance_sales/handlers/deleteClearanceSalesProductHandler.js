const getClearanceSalesProductServices = require("../services/clearanceSalesServices");

function deleteClearanceSalesProductHandler(fastify) {
  const deleteClearanceSalesProduct = getClearanceSalesProductServices.deleteClearanceSalesProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteClearanceSalesProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteClearanceSalesProductHandler;
