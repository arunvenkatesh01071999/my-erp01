const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getTransactionProviderKeySchema = {
  tags: ["Transaction Provider  INFO"],
  summary: "This API is to get Transaction Provider  Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      merchant_key: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        transaction_provider: { type: "string" },
        merchant_id: { type: "string" },
        merchant_key: { type: "string" },
        url: { type: "string" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getTransactionProviderKeySchema;
