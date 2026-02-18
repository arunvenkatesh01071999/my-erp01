const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteStorePurchaseReturnSchema = {
  tags: ["PURCHASE RETURN"],
  summary: "This API is to delete purchase return",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_return_id: { type: "integer" }
    },
    required: ["purchase_return_id"]
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

module.exports = deleteStorePurchaseReturnSchema;
