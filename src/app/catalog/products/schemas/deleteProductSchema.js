const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteProductSchema = {
  tags: ["PRODUCTS"],
  summary: "This API is to delete products",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      product_id: { type: "integer" }
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

module.exports = deleteProductSchema;
