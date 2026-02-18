const paymentServices = require("../services/itemServices");

function postpaymentHandler(fastify) {
  const postpayment = paymentServices.postpaymentService(fastify);

  return async (request, reply) => {
    const { params, body, logTrace, userDetails } = request;
    const response = await postpayment({
      params,
      body,
      logTrace,
      userDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = postpaymentHandler;
