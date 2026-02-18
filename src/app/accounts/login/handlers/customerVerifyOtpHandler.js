const customerLoginServices = require("../services/customerLoginServices");

function customerVerifyOtpHandler(fastify) {
  // console.log("verify otp hanlder")
  const customerVerifyOtp =
    customerLoginServices.customerVerifyOtpService(fastify);
  return async (request, reply) => {
    const { body, params, logTrace, otpDetails } = request;
    const response = await customerVerifyOtp({
      body,
      params,
      logTrace,
      otpDetails
    });
    return reply.code(200).send(response);
  };
}

module.exports = customerVerifyOtpHandler;
