const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postReasonSchema = {
  tags: ["Reason"],
  summary: "This API is to post categories",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["reason_name", "is_active"],
    properties: {
      reason_name: {
        type: "string",
      },
      is_active: { type: "boolean" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postReasonSchema;
