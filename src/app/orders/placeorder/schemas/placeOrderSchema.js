const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const placeOrderSchema = {
  tags: ["CART"],
  summary:
    "This API is used to do place order operations. 'order_mode - 1' for prepaid, 'order_mode - 2' for COD, 'order_type-0' for ANDROID,'order_type-1' for IOS,'order_type-2' for WEB ",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["address_id", "order_mode", "order_type", "transaction_id"],
    additionalProperties: false,
    properties: {
      address_id: { type: "integer" },
      order_mode: { type: "integer" },
      order_type: { type: "integer" },
      transaction_id: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        order_number: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = placeOrderSchema;
