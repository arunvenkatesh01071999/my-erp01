const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteReasonSchema = {
  tags: ["Reason"],
  summary: "This API is to delete Reason",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      reason_id: { type: "integer" }
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

module.exports = deleteReasonSchema;
