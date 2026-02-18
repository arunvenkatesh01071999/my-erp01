const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierByProductSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to get SUPPLIER",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          supplier_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          gst: { type: "boolean" },
          igst: { type: "boolean" },
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSupplierByProductSchema;
