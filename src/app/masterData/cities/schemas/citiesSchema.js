const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const citiesSchema = {
  tags: ["Fetch Cities"],
  summary: "This API is used to fetch Cities",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["state_id"],
    additionalProperties: false,
    properties: {
      state_id: { type: "integer" }
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
          state_id: { type: "integer" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = citiesSchema;
