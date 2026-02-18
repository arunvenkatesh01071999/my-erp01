const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getGrnOutletSupplierPonoSchema = {
  tags: ["Grn Outlet Supplier pono "],
  summary: "API to list po numbers grn outlet and supplier based.",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" }
    },
    required: ["outlet_id", "supplier_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          pono: { type: "string" },
          po_date: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string" },
          supplier_id: { type: "integer" },
          outlet_id: { type: "integer" },
          supplier_name: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getGrnOutletSupplierPonoSchema;


