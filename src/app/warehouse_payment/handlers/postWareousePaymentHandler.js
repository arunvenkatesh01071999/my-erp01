const getWareousePaymentService = require("../services/getWareousePaymentService");

function postWarehousePaymentHandler(fastify) {
  const postWarehousePayment = getWareousePaymentService.postWareousePaymentService(fastify);

  return async (request, reply) => {
    const { body, params, logTrace, userDetails } = request;
    const response = await postWarehousePayment({
      body,
      params,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postWarehousePaymentHandler;
