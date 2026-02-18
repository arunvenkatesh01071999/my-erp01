const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const purchaseOrderRegionsSchema = {
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
          region_name: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = purchaseOrderRegionsSchema;
