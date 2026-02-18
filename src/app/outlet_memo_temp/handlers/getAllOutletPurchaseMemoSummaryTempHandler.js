const memoTempService = require("../services/memoTempService.js");

function getAllOutletPurchaseMemoSummaryTempHandler(fastify) {
  const getAllOutletPurchaseMemoSummaryTemp = memoTempService.getAllOutletPurchaseMemoSummaryTempService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getAllOutletPurchaseMemoSummaryTemp({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getAllOutletPurchaseMemoSummaryTempHandler;
