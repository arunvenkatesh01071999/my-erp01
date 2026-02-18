const { errorSchemas } = require("../../../../commons/schemas/errorSchemas");


const monthOutletSalesSchema = {
  tags: ["Month Outlet Sales"],
  summary: "This API is to get month sales",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      year: {
        type: "string",
        pattern: "^[0-9]{4}$" // Regular expression for 4-digit year format
      },
      month: {
        type: "string",
        pattern: "^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$"
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        year: { type: "string" },
        month: { type: "string" },
        total_no_of_sales: { type: "integer" },
        total_amount: { type: "number" },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              no_of_sales: { type: "string" },
              amount: { type: "string" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = monthOutletSalesSchema;
