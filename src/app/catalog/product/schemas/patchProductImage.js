const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const patchProductImage = {
  tags: ["PRODUCT"],
  summary: "This API is to replace product images",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      product_code: { type: "string" }
    }
  },
  body: {
    type: "array",
    items: {
      type: "object",
      required: ["media_id"],
      properties: {
        media_id: { type: "string", format: "uuid" },
        position: { type: "number" },
        is_primary_for_store: { type: "boolean" }
      }
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

module.exports = patchProductImage;
