const typedesignServices = require("../services/typedesignServices");

function getTypedesignInfoHandler(fastify) {
  const getTypedesignInfo = typedesignServices.getTypedesignInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTypedesignInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTypedesignInfoHandler;
