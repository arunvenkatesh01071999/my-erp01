const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const sms = require("../../../notification/repository/whatsotpsms");

function customerSendOtpService(fastify) {
  return async ({ params, body, logTrace }) => {
    const { sendOtpSms } = sms(fastify);
    const phone_number = `91${body.mobile}`;
    const { otp, token } = fastify.generateOtpAndTokenWithJWT(phone_number);

    const result = sendOtpSms(phone_number, otp);
    console.log(result);
    return {
      success: true,
      message: "OTP has been sent to your mobile number",
      token
    };
  };
}
function customerVerifyOtpService(fastify) {

  return async ({ params, body, logTrace, otpDetails }) => {
    try {
      const storedOtp = otpDetails.otp;

      if (body.otp != storedOtp) {
        return {
          success: false,
          message: "OTP is not valid"
        };
      }
      return {
        success: true,
        message: "OTP has been verified successfully"
      };

    }
    catch (error) {
      if (error.name === "TokenExpiredError") {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "OTP has been Expired",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }
  };
}

module.exports = {
  customerSendOtpService,
  customerVerifyOtpService

};
