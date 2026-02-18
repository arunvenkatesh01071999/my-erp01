const memoService= require("../services/memoService.js");

function putOutletPurchaseMemoInvoiceNoHandler(fastify) {
  const putOutletPurchaseMemoInvoiceNo = memoService.putOutletPurchaseMemoInvoiceNoService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await putOutletPurchaseMemoInvoiceNo({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = putOutletPurchaseMemoInvoiceNoHandler;
