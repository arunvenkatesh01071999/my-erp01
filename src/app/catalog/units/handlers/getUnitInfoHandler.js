const unitServices = require("../services/unitServices");

function getUnitInfoHandler(fastify) {
  const getUnitInfo = unitServices.getUnitInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getUnitInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getUnitInfoHandler;
