const unitServices = require("../services/unitServices");

function getUnitHandler(fastify) {
  const getUnit = unitServices.getUnitService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getUnit({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getUnitHandler;
