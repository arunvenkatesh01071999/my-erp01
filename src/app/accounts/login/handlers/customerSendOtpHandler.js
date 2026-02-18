const customerLoginServices = require("../services/customerLoginServices");

function customerLoginHandler(fastify) {
  const customerSendOtp = customerLoginServices.customerSendOtpService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace } = request;
    const response = await customerSendOtp({ body, params, logTrace });
    return reply.code(200).send(response);
  };
}

module.exports = customerLoginHandler;
