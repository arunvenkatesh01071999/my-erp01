const getWareousePaymentService = require("../services/getWareousePaymentService");

function getWareousePaymentOutstandingBillSupplierlistHandler(fastify) {
  const getWareousePaymentOutstandingBillSupplierlist = getWareousePaymentService.getWareousePaymentOutstandingBillSupplierlistService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getWareousePaymentOutstandingBillSupplierlist({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getWareousePaymentOutstandingBillSupplierlistHandler;
