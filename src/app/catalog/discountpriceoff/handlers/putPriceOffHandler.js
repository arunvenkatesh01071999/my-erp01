const offerMasterServices = require("../services/priceOfferServices");

function putOfferMasterHandler(fastify) {
  const putOfferMaster = offerMasterServices.putOfferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await putOfferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = putOfferMasterHandler;
