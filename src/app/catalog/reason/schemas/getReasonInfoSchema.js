const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getReasonInfoSchema = {
  tags: ["Reason INFO"],
  summary: "This API is to fetch categories info",
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
        id: { type: "integer" },
        reason_name: { type: "string" },
        is_active: { type: "boolean" }
      }
    },

    ...errorSchemas
  }
};

module.exports = getReasonInfoSchema;
