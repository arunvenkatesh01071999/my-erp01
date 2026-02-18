const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putItemDiscountSchema = {
  tags: ["Item"],
  summary: "This API is to post Item",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "barcode_details",
      "special_discount",
    ],
    properties: {
      barcode_details: {
        type: "array",
        items: {
          type: "object",
          required: ["barcode", "prod_id"],
          properties: {
            barcode: { type: "string" },
            prod_id: { type: "integer" },
          }
        }
      },
      special_discount: { type: "number" },

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

module.exports = putItemDiscountSchema;
