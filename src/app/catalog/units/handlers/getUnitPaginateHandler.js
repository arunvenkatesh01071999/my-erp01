const unitServices = require("../services/unitServices");

function getUnitPaginateHandler(fastify) {
  const getUnitPaginate = unitServices.getUnitPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getUnitPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getUnitPaginateHandler;
