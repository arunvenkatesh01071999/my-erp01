const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getReasonSchema = {
  tags: ["Reason"],
  summary: "This API is to fetch reasons",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          reason_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getReasonSchema;
