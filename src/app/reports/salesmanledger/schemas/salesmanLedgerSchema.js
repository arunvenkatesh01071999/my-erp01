const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesmanLedgerSchema = {
  tags: ["Salesman Ledger"],
  summary: "This API is to get salesman ledger report",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["from_date", "to_date"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          salesman_id: { type: "integer" },
          sales_man_name: { type: "string" },
          total_sales: { type: "string" },
          total_return: { type: "string" }

        }
      }
    },
    ...errorSchemas
  }
};

module.exports = salesmanLedgerSchema;
