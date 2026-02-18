const offerMasterServices = require("../services/freeProductServices");

function postPromotionsHandler(fastify) {
  const postOfferMaster = offerMasterServices.postOfferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOfferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPromotionsHandler;
