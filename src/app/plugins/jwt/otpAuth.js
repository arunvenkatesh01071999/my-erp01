const fp = require("fastify-plugin");

const authenticateOtpPlugin = async fastify => {
  fastify.decorate("authenticate_otp", async (request, reply) => {
    try {
      const decodedToken = await request.jwtVerify();
      // console.log("userDetails" + JSON.stringify(decodedToken));
      // console.log(decodedToken.response[0].id);
      // console.log(decodedToken);
      // request.userDetails = decodedToken.response[0];
      request.otpDetails = decodedToken;
    } catch (err) {
      reply.send(err);
    }
  });
};

module.exports = fp(authenticateOtpPlugin);
