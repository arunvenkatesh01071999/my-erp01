const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putStorePurchaseReturnSchema = {
  tags: ["PURCHASE RETURN"],
  summary: "This API is to post purchase return",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_return_id: { type: "integer" }
    },
    required: ["purchase_return_id"]
  },
  body: {
    type: "object",
    required: [
      "docdate",
      "supplier_id",
      "total_amount",
      "discount_amount",
      "grand_total",
      "roff",
      "outlet_id",
      "company_id",
      "wh_id",
      "type",
      "gst",
      "igst",
      "cess_amt",
      "remark",
      "tds_percentage",
      "tds_amount",
      "purchase_return_details"
    ],
    properties: {
      docdate: { type: "string" },
      supplier_id: { type: "integer" },
      outlet_id: { type: "integer" },
      total_amount: { type: "number" },
      discount_amount: { type: "number" },
      grand_total: { type: "number" },
      purchase_master_id: { type: "integer" },
      invoice_no: { type: "string" },
      invoice_date: { type: "string" },
      roff: { type: "number" },
      company_id: { type: "integer" },
      wh_id: { type: "integer" },
      type: { type: "integer" },
      gst: { type: "number" },
      igst: { type: "number" },
      cess_amt: { type: "number" },
      remark: { type: "string" },
      tds_percentage: { type: "number" },
      tds_amount: { type: "number" },
      purchase_return_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            "product_id",
            "product_code",
            "batch_no",
            "expiry_date",
            "return_qty",
            "return_free_qty",
            "discount_percentage",
            "discount_amount",
            "rate",
            "amount",
            "mrp",
            "gst",
            "igst",
            "cess",
            "cess_amt",
            "reason"
          ],
          properties: {
            product_id: { type: "integer" },
            product_code: { type: "string" },
            batch_no: { type: "string" },
            expiry_date: { type: "string" },
            accepted_qty: { type: "number" },
            accepted_free_qty: { type: "number" },
            return_qty: { type: "number" },
            return_free_qty: { type: "number" },
            discount_percentage: { type: "number" },
            discount_amount: { type: "number" },
            rate: { type: "number" },
            amount: { type: "number" },
            mrp: { type: "number" },
            gst: { type: "number" },
            igst: { type: "number" },
            gst_amount: { type: "number" },
            igst_amount: { type: "number" },
            cess: { type: "number" },
            cess_amt: { type: "number" },
            reason: { type: "integer" }
          }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putStorePurchaseReturnSchema;
