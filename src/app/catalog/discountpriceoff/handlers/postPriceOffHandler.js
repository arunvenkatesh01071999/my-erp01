const offerMasterServices = require("../services/priceOfferServices");

function postPriceOffHandler(fastify) {
  const postOfferMaster = offerMasterServices.postOfferMasterService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    console.log("body",body)
    const response = await postOfferMaster({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postPriceOffHandler;
