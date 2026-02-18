const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCustomerMappingSchema = {
  tags: ["SALES CUSTOMER MAPPING PRODUCT"],
  summary: "This API is customer mapping products will be listed",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customer_name: { type: "string" },
          add1: { type: ["string", "null"] },
          add2: { type: ["string", "null"] },
          gst_type: { type: "string" },
          customer_type: { type: "string" },
        },
      }
    },
    ...errorSchemas,
  },
};

module.exports = getCustomerMappingSchema;
