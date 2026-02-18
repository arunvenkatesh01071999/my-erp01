const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerPaginateSchema = {
  tags: ["CONSUMER"],
  summary: "This API is to get Consumer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
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
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerPaginateSchema;
