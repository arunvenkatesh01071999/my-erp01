const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerInfoSchema = {
  tags: ["CONSUMER INFO"],
  summary: "This API is to get Consumer Info",
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
        id: { type: "integer" },
        consumer_name: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerInfoSchema;
