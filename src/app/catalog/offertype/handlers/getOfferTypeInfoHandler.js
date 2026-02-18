const offerTypeServices = require("../services/offerTypeServices");

function getOfferTypeInfoHandler(fastify) {
  const getOfferTypeInfo = offerTypeServices.getOfferTypeInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOfferTypeInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOfferTypeInfoHandler;
