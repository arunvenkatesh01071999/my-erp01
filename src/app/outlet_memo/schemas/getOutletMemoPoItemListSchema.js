const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletMemoPoItemListSchema = {
  tags: ["PO ITEM DETAILS"],
  summary: "API to list PO product details for an outlet",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["outlet_id", "po_no", "supplier_id"],
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      po_no: { type: "string" },
    }
  },
  querystring: {
    type: "object",
    properties: {
      search: { type: "string" }
    }
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          product_code: { type: "string" },
          product_name: { type: "string" },
          po_order_qty: { type: "number" },
          po_mrp: { type: "number" },
          uom_id: { type: "integer" },
          uom_name: { type: "string" },
          expiry_type_id: { type: "integer" },
          expiry_value: { type: "integer" },
          type_id: { type: "integer" },
          invoice_amount: { type: "number" },
          image_url: { type: "string" }

        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getOutletMemoPoItemListSchema;
