const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOutletApprovedPoSchema = {
  tags: ["Outlet Purchase Order Update"],
  summary: "API to update outlet purchase orders product-wise (quantity, GST, CESS, grand total recalculation)",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      supplier_id: { type: "integer" }
    },
    required: ["company_id", "supplier_id"]
  },
  body: {
    type: "object",
    required: ["product_details"],
    properties: {
      product_details: {
        type: "array",
        description: "List of product-wise purchase order details to update",
        items: {
          type: "object",
          required: ["product_code", "outlet_id", "po_date", "po_no", "quantity"],
          properties: {
            product_code: { type: "string", description: "Product code of the item" },
            outlet_id: { type: "integer", description: "Outlet ID of the PO" },
            po_date: { type: "string",description: "Purchase order date" },
            po_no: { type: "string", description: "Purchase order number" },
            quantity: { type: "number", description: "New quantity to update" },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = putOutletApprovedPoSchema;
