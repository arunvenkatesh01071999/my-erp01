const offerMasterServices = require("../services/priceOfferServices");

function getOfferMasterPaginateHandler(fastify) {
  const getOfferMasterPaginate = offerMasterServices.getOfferMasterPaginateService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, query } = request;
    const response = await getOfferMasterPaginate({ body, params, logTrace, query });
    return reply.code(200).send(response);
  };
}

module.exports = getOfferMasterPaginateHandler;
