const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const statesDeliveryAmountSchema = {
  tags: ["Update delievery amont"],
  summary: "This API is used to update delivery amount",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["state_id", "delivery_amount"],
    additionalProperties: false,
    properties: {
      state_id: { type: "integer" },
      delivery_amount: { type: "number" }
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

module.exports = statesDeliveryAmountSchema;
