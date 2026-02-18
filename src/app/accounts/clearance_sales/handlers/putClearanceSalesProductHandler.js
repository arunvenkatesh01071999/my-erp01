const getClearanceSalesProductServices = require("../services/clearanceSalesServices");

function putClearanceSalesProductHandler(fastify) {
  const putClearanceSalesProduct = getClearanceSalesProductServices.putClearanceSalesProductService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putClearanceSalesProduct({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putClearanceSalesProductHandler;
