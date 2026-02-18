const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseOutletListSchema = {
  tags: ["Supplier"],
  summary: "API to list suppliers with detailed information",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      region_id: { type: "integer" },
    },
    required: ["region_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          outlet_full_name: { type: "string" },
          outlet_short_name: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getOutletPurchaseOutletListSchema;
