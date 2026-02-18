const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getGrnPurchaseOrderNumbersSchema = {
  tags: ["Supplier"],
  summary: "API to list suppliers with detailed information",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
    },
    required: ["outlet_id", "supplier_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pono: { type: "string" },
          podate: { type: "string" },
          memo_no: { type: "string" },
          memo_date: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getGrnPurchaseOrderNumbersSchema;
