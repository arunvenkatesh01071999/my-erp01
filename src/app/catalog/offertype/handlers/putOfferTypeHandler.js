const offerTypeServices = require("../services/offerTypeServices");

function putOfferTypeHandler(fastify) {
  const putOfferType = offerTypeServices.putOfferTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOfferType({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOfferTypeHandler;
