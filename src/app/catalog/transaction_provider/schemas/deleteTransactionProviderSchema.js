const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteTransactionProviderSchema = {
  tags: ["TransactionProvider"],
  summary: "This API is to delete TransactionProvider",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
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

module.exports = deleteTransactionProviderSchema;
