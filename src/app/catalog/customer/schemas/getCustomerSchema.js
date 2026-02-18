const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCustomerSchema = {
  tags: ["CUSTOMER"],
  summary: "This api is get customer",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCustomerSchema;
