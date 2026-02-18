const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletSupplierDetailsSchema = {
  tags: ["Supplier"],
  summary: "API to list suppliers with detailed information",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
    },
    required: ["outlet_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_id: { type: "integer" },
          short_name: { type: "string" },
          supplier_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getOutletSupplierDetailsSchema;
