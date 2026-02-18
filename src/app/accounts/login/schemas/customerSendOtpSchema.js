const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const customerSendOtpSchema = {
  tags: ["CUSTOMERS LOGIN"],
  summary: "This API is to login customers",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["mobile"],
    properties: {
      mobile: {
        type: "string",
        pattern: "^[0-9]{10}$" // Regular expression to match exactly 10 digits
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        token: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = customerSendOtpSchema;
