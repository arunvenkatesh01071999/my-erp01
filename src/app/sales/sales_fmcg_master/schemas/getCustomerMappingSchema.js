const { type } = require("tap");
const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCustomerMappingSchema = {
  tags: ["SALES CUSTOMER MAPPING PRODUCT"],
  summary: "This API is customer mapping products will be listed",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      customer_id: { type: "integer" },
      type_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          product_code: { type: "string" },
          product_name: { type: "string" },
          uom_name: { type: "string" },
          uom_id: { type: "integer" }
        },
      }
    },
    ...errorSchemas,
  },
};

module.exports = getCustomerMappingSchema;
