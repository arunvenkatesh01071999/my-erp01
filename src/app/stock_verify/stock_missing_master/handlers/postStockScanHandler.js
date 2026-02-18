const getStockMissingMstServices = require("../services/getStockMissingMstServices");


function postStackScanHandler(fastify) {
  const postStackScan = getStockMissingMstServices.postStackScanService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postStackScan({ params, body, logTrace, userDetails });
    return reply.code(200).send(response);
  };
}

module.exports = postStackScanHandler;
