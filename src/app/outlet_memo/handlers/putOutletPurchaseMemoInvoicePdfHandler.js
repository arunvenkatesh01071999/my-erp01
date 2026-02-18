const memoService= require("../services/memoService.js");

function putOutletPurchaseMemoInvoicePdfHandler(fastify) {
  const putOutletPurchaseMemoInvoicePdf = memoService.putOutletPurchaseMemoInvoicePdfService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putOutletPurchaseMemoInvoicePdf({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPurchaseMemoInvoicePdfHandler;
