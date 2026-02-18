const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putTransactionProviderSchema = {
  tags: ["AccountMaster"],
  summary: "This API is to update AccountMaster",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
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

module.exports = putTransactionProviderSchema;
