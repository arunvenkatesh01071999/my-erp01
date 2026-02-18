const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteConsumerSchema = {
  tags: ["CONSUMER"],
  summary: "This API is to delete Consumer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      consumer_id: { type: "integer" }
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

module.exports = deleteConsumerSchema;
