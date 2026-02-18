const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putReasonSchema = {
  tags: ["Reason"],
  summary: "This API is to update categories",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      Reason_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["reason_name", "is_active"],
    properties: {
      reason_name: {
        type: "string"
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

module.exports = putReasonSchema;
