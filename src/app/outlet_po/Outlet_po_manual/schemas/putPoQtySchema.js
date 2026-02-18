const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPoQtySchema = {
  tags: ["Outlet Purchase Order Update"],
  summary: "API to update outlet purchase orders product-wise (quantity, GST, CESS, grand total recalculation)",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["product_details"],
    properties: {
      product_details: {
        type: "array",
        description: "List of product-wise purchase order details to update",
        items: {
          type: "object",
          required: ["product_code", "po_no", "quantity", "supplier_id", "outlet_id"],
          properties: {
            product_code: { type: "string", description: "Product code of the item" },
            po_no: { type: "string", description: "Purchase order number" },
            quantity: { type: "number", description: "New quantity to update" },

            supplier_id: { type: "integer", description: "Supplier ID for the PO detail" },
            outlet_id: { type: "integer", description: "Outlet ID for the PO detail" },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      },
    },
    ...errorSchemas,
  },
};

module.exports = putPoQtySchema;
