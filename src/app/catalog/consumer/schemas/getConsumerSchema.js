const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerSchema = {
  tags: ["CONSUMER"],
  summary: "This API is to get Consumer",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          consumer_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerSchema;
