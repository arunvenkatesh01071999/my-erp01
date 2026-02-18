const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const customerVerifyOtpSchema = {
  tags: ["CUSTOMERS VERIFY OTP"],
  summary: "This API is to verify otp",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["otp"],
    properties: {
      otp: {
        type: "string",
        pattern: "^[0-9]{4}$" // Regular expression to match exactly 4 digits
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      }
    },
    ...errorSchemas
  }
};

module.exports = customerVerifyOtpSchema;
