const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const orderStatusChangeSchema = {
  tags: ["ORDERS STATUS CHANGE"],
  summary:
    "This API is to  change order's status For neworder-0,processing-1,invoice-2,transists-3,delivered-4,canceled-5",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["order_id", "status"],
    additionalProperties: false,
    properties: {
      order_id: { type: "integer" },
      status: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "string" },
        message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = orderStatusChangeSchema;
