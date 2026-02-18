const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const orderYearSalesSchema = {
  tags: ["ORDERS"],
  summary: "This API is to get year sales",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      year: {
        type: "string",
        pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        year: { type: "string" },
        total_no_of_order: { type: "integer" },
        total_amount: { type: "number" },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              year: { type: "string" },
              month: { type: "string" },
              no_of_order: { type: "string" },
              amount: { type: "string" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = orderYearSalesSchema;
