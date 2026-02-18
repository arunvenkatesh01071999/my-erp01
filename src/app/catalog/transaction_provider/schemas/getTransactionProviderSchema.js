const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTransactionProviderSchema = {
  tags: ["TransactionProvider"],
  summary: "This API is to get TransactionProvider",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          transaction_provider: { type: "string" },
          merchant_id: { type: "string" },
          merchant_key: { type: "string" },
          url: { type: "string" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getTransactionProviderSchema;
