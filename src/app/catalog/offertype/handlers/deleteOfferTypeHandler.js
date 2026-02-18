const offerTypeServices = require("../services/offerTypeServices");

function deleteOfferTypeHandler(fastify) {
  const deleteOfferType = offerTypeServices.deleteOfferTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteOfferType({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deleteOfferTypeHandler; 