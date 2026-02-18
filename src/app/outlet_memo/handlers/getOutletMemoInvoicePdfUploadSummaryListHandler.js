const memoService = require("../services/memoService.js");

function getOutletMemoInvoicePdfUploadSummaryListHandler(fastify) {
  const getOutletMemoInvoicePdfUploadSummaryList = memoService.getOutletMemoInvoicePdfUploadSummaryListService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails, query } = request;
    const response = await getOutletMemoInvoicePdfUploadSummaryList({
      body,
      params,
      logTrace,
      userDetails,
      query
    });
    return reply.code(200).send(response);
  };
}

module.exports = getOutletMemoInvoicePdfUploadSummaryListHandler;
