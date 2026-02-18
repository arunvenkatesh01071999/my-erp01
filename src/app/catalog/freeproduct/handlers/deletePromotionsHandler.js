const offerTypeServices = require("../services/freeProductServices");

function deletePromotionsHandler(fastify) {
  const deleteOfferMaster = offerTypeServices.deleteOfferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await deleteOfferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = deletePromotionsHandler; 