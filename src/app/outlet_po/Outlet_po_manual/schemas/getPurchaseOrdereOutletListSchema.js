const { errorSchemas } = require("../../../commons/schemas/errorSchemas");
const getPurchaseOrdereOutletListSchema = {
  tags: ["Regions"],
  summary: "API to list oulets with detailed information",
  headers: { $ref: "request-headers#" },
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

module.exports = getPurchaseOrdereOutletListSchema;
