const typedesignServices = require("../services/typedesignServices");

function getTypedesignHandler(fastify) {
  const getTypedesignInfo = typedesignServices.getTypedesignService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTypedesignInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTypedesignHandler;
