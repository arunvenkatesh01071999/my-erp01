const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/sendotp",
    schema: schemas.customerSendOtpSchema,
    handler: handlers.customerSendOtpHandler(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/verifyotp",
    preHandler: fastify.authenticate_otp, // Apply JWT authentication decorator
    schema: schemas.customerVerifyOtpSchema,
    handler: handlers.customerVerifyOtpHandler(fastify)
  });
};
