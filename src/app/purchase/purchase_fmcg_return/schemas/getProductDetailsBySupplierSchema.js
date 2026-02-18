const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductDetailsBySupplierSchema = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          product_code: { type: "string" },
          product_name: { type: "string" },
        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getProductDetailsBySupplierSchema;

