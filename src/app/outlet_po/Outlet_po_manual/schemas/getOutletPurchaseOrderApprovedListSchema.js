const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletPurchaseOrderApprovedListSchema = {
  tags: ["GET OUTLET PURCHASE ORDER APPROVED LIST"],
  summary: "API to list outlet purchase order",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      region_id: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outlet_name: { type: "string" },
          supplier_name: { type: "string" },
          po_no: { type: "string" },
          po_date: { type: "string", format: "date" },
          type: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletPurchaseOrderApprovedListSchema;
