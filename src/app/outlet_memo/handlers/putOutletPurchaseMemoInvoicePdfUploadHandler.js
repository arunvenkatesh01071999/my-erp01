const memoService= require("../services/memoService.js");

function putOutletPurchaseMemoInvoicePdfUploadHandler(fastify) {
  const putOutletPurchaseMemoInvoicePdfUpload = memoService.putOutletPurchaseMemoInvoicePdfUploadService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putOutletPurchaseMemoInvoicePdfUpload({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPurchaseMemoInvoicePdfUploadHandler;
