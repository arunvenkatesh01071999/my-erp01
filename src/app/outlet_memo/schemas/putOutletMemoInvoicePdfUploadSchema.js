const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const putOutletMemoInvoicePdfClearSchema = {
  tags: ["OUTLET PURCHASE MEMO"],
  summary: "Clear invoice PDF and update remark for outlet purchase memo",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    required: ["outlet_id", "po_no"],
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      po_no: { type: "string" }
    }
  },

  body: {
    type: "object",
    required: ["invoice_url"],
    properties: {
      invoice_url: { type: "string" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putOutletMemoInvoicePdfClearSchema;
