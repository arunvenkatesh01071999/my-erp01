const typedesignServices = require("../services/typedesignServices");

function getBrandTypedesignInfoHandler(fastify) {
  const getBrandTypedesignInfo = typedesignServices.getBrandTypedesignInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getBrandTypedesignInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getBrandTypedesignInfoHandler;
