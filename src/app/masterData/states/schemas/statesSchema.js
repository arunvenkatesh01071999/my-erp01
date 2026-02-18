const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const stateSchema = {
  tags: ["Fetch States"],
  summary: "This API is used to fetch States",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["country_id"],
    additionalProperties: false,
    properties: {
      country_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          country_id: { type: "integer" },
          delivery_amount: { type: "number" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = stateSchema;
