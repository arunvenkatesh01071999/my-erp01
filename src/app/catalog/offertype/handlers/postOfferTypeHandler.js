const offerTypeServices = require("../services/offerTypeServices");

function postOfferTypeHandler(fastify) {
  const postOfferType = offerTypeServices.postOfferTypeService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postOfferType({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postOfferTypeHandler;
