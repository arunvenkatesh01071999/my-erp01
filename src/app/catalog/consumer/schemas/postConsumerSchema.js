const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postConsumerSchema = {
  tags: ["CONSUMER"],
  summary: "This API is to post Consumer",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["consumer_name", "company_id", "is_active"],
    properties: {
      consumer_name: { type: "string" },
      company_id: { type: "integer" },
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

module.exports = postConsumerSchema;
