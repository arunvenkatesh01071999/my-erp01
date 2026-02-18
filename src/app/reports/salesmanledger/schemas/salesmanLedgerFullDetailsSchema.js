const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesmanLedgerFullDetailsSchema = {
  tags: ["Salesman Ledger full details"],
  summary: "This API is to get salesman ledger report",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["salesman_id"],
    additionalProperties: false,
    properties: {
      salesman_id: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          docdate: { type: "string" },
          fullname: { type: "string" },
          sales: { type: "string" },
          return: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = salesmanLedgerFullDetailsSchema;
