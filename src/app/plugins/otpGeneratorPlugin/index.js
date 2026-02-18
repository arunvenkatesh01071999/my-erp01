const fp = require("fastify-plugin");
const generateOtpAndToken = require("./otpGenerator");

function otpGeneratorPlugin(fastify, opts, next) {
  const { jwt } = fastify;

  function generateOtpAndTokenWithJWT(phone_number) {
    const { otp, token } = generateOtpAndToken(phone_number);

    // You can also sign the OTP using fastify-jwt
    const signedOtp = jwt.sign({ otp }, { expiresIn: "120s" });

    return { otp, token, signedOtp };
  }

  fastify.decorate("generateOtpAndTokenWithJWT", generateOtpAndTokenWithJWT);
  next();
}

module.exports = fp(otpGeneratorPlugin, { name: "otpGenerator" });
