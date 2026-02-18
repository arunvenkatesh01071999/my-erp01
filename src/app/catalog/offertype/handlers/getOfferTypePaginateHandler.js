const offerTypeServices = require("../services/offerTypeServices");

function getOfferTypePaginateHandler(fastify) {
  const getOfferTypePaginate = offerTypeServices.getOfferTypePaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOfferTypePaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOfferTypePaginateHandler;
