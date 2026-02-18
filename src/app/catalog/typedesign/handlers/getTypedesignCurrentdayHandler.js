const typedesignServices = require("../services/typedesignServices");

function getTypedesignCurrentdayHandler(fastify) {
  const getTypedesignCurrentdayService = typedesignServices.getTypedesignCurrentdayService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getTypedesignCurrentdayService({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getTypedesignCurrentdayHandler;
