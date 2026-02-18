const getWareousePaymentService = require("../services/getWareousePaymentService");

function getWareousePaymentOutstandingBillListHandler(fastify) {
  const getWareousePaymentOutstandingBillList = getWareousePaymentService.getWareousePaymentOutstandingBillListService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await getWareousePaymentOutstandingBillList({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = getWareousePaymentOutstandingBillListHandler;
