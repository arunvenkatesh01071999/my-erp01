const getStockMissingMstServices = require("../services/getStockMissingMstServices");

function postStockMissingMstHandler(fastify) {
  const postStockMissingMst = getStockMissingMstServices.postStockMissingMstService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postStockMissingMst({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postStockMissingMstHandler;
