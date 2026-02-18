const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPOGrnSchema = {
  tags: ["Purchase Order Grn Schema"],
  summary: "This API fetches all purchase GRN master info (PO, Invoice, Supplier)",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" }
    },
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pono: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string", format: "date" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" }
        },
        required: ["pono", "invoice_no", "supplier_id", "supplier_name"]
      }
    },
    ...errorSchemas
  }
};

module.exports = getPOGrnSchema;
