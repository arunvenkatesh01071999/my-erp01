const getWareousePaymentService = require("../services/getWareousePaymentService");

function getWareousePaymentOutstandingBillSupplierlDetailsHandler(fastify) {
  const getWareousePaymentOutstandingBillSupplierlDetails = getWareousePaymentService.getWareousePaymentOutstandingBillSupplierlDetailsService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getWareousePaymentOutstandingBillSupplierlDetails({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getWareousePaymentOutstandingBillSupplierlDetailsHandler;
