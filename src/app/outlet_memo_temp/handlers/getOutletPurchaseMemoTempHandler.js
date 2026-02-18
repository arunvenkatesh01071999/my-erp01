const memoTempService = require("../services/memoTempService.js");

function getOutletPurchaseMemoTempHandler(fastify) {
  const getOutletPurchaseMemoTemp = memoTempService.getOutletPurchaseMemoTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletPurchaseMemoTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseMemoTempHandler;
