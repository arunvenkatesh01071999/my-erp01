const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteOutletPurchaseOrderProductSchema = {
  tags: ["Outlet PurchaseOrder"],
  summary: "API to delete a Outlet Purchase Order",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      po_no: { type: "string" },
      company_id: { type: "integer" },
      outlet_id: { type: "integer" }
    },
    required: ["po_no"] // ✅ Ensures `po_no` is mandatory
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas // ✅ Standard error handling
  }
};

module.exports = deleteOutletPurchaseOrderProductSchema;
