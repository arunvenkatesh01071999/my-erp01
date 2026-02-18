const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseEditListSchema = {
  tags: ["GET PURCHASE EDIT LIST"],
  summary: "API to list purchase order",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          supplier_name: { type: "string" },
          docdate: { type: "string", format: "date" }, // Corrected type
          gst: { type: "boolean" },
          igst: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseEditListSchema;
