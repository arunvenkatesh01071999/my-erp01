const outletServices = require("../services/outletServices");

function getOutletInfoHandler(fastify) {
  const getOutletInfo = outletServices.getOutletInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOutletInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletInfoHandler;
