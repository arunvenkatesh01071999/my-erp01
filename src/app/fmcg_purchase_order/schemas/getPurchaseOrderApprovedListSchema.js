const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseOrderApprovedListSchema = {
  tags: ["GET PURCHASE ORDER APPROVED LIST"],
  summary: "API to list purchase order",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_name: { type: "string" },
          pono: { type: "string" },
          podate: { type: "string", format: "date" }, // Corrected type
          isEdit: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseOrderApprovedListSchema;
