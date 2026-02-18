const getClearanceSalesProductServices = require("../services/clearanceSalesServices");

function getClearanceSalesProductByDocnoHandler(fastify) {
  const getClearanceSalesProductByDocno = getClearanceSalesProductServices.getClearanceSalesProductByDocnoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getClearanceSalesProductByDocno({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getClearanceSalesProductByDocnoHandler;
