const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putConsumerSchema = {
  tags: ["CONSUMER"],
  summary: "This API is to update Consumer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      consumer_id: { type: "integer" }
    }
  },
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

module.exports = putConsumerSchema;
