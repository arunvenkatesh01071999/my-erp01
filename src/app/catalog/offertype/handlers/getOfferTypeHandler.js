const offerTypeServices = require("../services/offerTypeServices");

function getOfferTypeHandler(fastify) {
  const getOfferType = offerTypeServices.getOfferTypeService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOfferType({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getOfferTypeHandler;
