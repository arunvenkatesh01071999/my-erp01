const offerMasterServices = require("../services/offerMasterServices");

function postOfferMasterHandler(fastify) {
  const postOfferMaster = offerMasterServices.postOfferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOfferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOfferMasterHandler;
