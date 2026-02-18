const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postTransactionProviderSchema = {
  tags: ["TransactionProvider"],
  summary: "This API is to post Transaction Provider",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["transaction_provider", "merchant_id", "merchant_key", "url"],
    properties: {
      transaction_provider: { type: "string" },
      merchant_id: { type: "string" },
      merchant_key: { type: "string" },
      url: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postTransactionProviderSchema;
