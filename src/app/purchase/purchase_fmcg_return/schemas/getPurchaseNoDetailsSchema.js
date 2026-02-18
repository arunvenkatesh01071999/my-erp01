const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseNoDetailsSchema = {
  tags: ["Item INFO"],
  summary: "This API is to get Item Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" },
      purchase_id: { type: "integer" }
    },
    required: ["supplier_id", "purchase_id"]
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          invoice_no: { type: "string" },
          invoice_date: { type: "string" },
          product_id: { type: "integer" },
          product_code: { type: "string" },
          product_name: { type: "string" },
          batch_no: { type: "string" },
          expiry_date: { type: "string", format: "date" },
          supplier_id: { type: "integer" },
          purchase_master_id: { type: "integer" },
          accepted_qty: { type: "number" },
          return_qty: { type: "number" },
          accepted_free_qty: { type: "number" },
          return_free_qty: { type: "number" },
          uom_id: { type: "integer" },
          unit_name: { type: "string" },
          mrp: { type: "number" }, // ✔️ Because in response, it's a string ("210.00")
          purchase_rate: { type: "number" },
          discount_percentage: { type: "number" },
          discount_amount: { type: "number" },
          gst: { type: "number" },
          gst_amount: { type: "number" },
          igst: { type: "number" },
          igst_amount: { type: "number" },
          cess: { type: "number" },
          cess_amount: { type: "number" },
          balance: { type: "number" },
          reason: { type: "string" },
          amount: { type: "number" },
          remark: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseNoDetailsSchema;
