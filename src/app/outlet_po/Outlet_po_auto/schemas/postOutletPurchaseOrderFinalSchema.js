const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletPurchaseOrderFinalSchema = {
  tags: ["Outlet PurchaseOrder"],
  summary: "This API is to post an Outlet Purchase Order",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "outlet_id"
    ],
    properties: {
      outlet_id: {
        type: "integer",
        errorMessage: "outlet_id must be an integer"
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        outlet_po_master_id: { type: "integer" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postOutletPurchaseOrderFinalSchema;
