const memoTempService = require("../services/memoTempService.js");

function getOutletPurchaseMemoTempReportHandler(fastify) {
  const getOutletPurchaseMemoTempReport = memoTempService.getOutletPurchaseMemoTempReportService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getOutletPurchaseMemoTempReport({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletPurchaseMemoTempReportHandler;
