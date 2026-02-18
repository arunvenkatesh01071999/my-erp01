const offerTypeServices = require("../services/offerMasterServices");

function getPromotionsInfoHandler(fastify) {
  const getOfferMasterInfo = offerTypeServices.getOfferMasterInfoService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await getOfferMasterInfo({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = getPromotionsInfoHandler;
