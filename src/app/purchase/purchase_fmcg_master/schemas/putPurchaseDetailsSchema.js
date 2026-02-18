const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPurchaseMasterSchema = {
  tags: ["Purchase Master Schema"],
  summary: "This API is to Post Purchase Master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      purchase_id: { type: "integer" }
    },
  },
  body: {
    type: "object",
    required: [
      "docdate",
      "supplier_id",
      "total_amount",
      "discount_amount",
      "grand_total",
      "invoice_no",
      "invoice_date",
      "roff",
      "return_amount",
      "company_id",
      "other_charges",
      "gst",
      "advance",
      "cess_amt",
      "less_amt",
      "tcs",
      "dc_no",
      "closing_stock",
      "opening_stock",
      "purchase",
      "sales",
      "sales_return",
      "debit_note",
      "profit",
      "percentage",
      "tds_percentage",
      "tds_amount",
      "reason_debite_note",
      "reason_debite_note_amount",
      "wh_id",
      "pono",
      "podate",
      "po_details",
      "purchase_fmcg_details",
      "purchase_tray_details"
    ],
    properties: {
      docdate: { type: "string", format: "date", errorMessage: "docdate must be a valid date string (YYYY-MM-DD)" },
      supplier_id: { type: "number", errorMessage: "supplier_id is required and must be a number" },
      total_amount: { type: "number" },
      discount_amount: { type: "number" },
      vatcat_amount: { type: "number" },
      grand_total: { type: "number" },
      invoice_no: { type: "string" },
      invoice_date: { type: "string", format: "date" },
      roff: { type: "number" },
      paid: { type: "number" },
      return_amount: { type: "number" },
      company_id: { type: "number" },
      other_charges: { type: "number" },
      gst: { type: "number" },
      igst: { type: "number" },
      advance: { type: "number" },
      cess_amt: { type: "number" },
      less_amt: { type: "number" },
      tcs: { type: "number" },
      dc_no: { type: "string" },
      closing_stock: { type: "number" },
      opening_stock: { type: "number" },
      purchase: { type: "number" },
      purchase_return: { type: "number" },
      sales: { type: "number" },
      sales_return: { type: "number" },
      debit_note: { type: "number" },
      profit: { type: "number" },
      percentage: { type: "number" },
      tds_percentage: { type: "number" },
      tds_amount: { type: "number" },
      reason_debite_note: { type: "string" },
      remark: { type: "string" },
      reason_debite_note_amount: { type: "number" },
      freight_charges: { type: "number" },
      wh_id: { type: "number" },
      pono: { type: "string" },
      podate: { type: "string", format: "date" },
      customer_type: { type: "integer" },
      po_details: {
        type: "array",
        items: {
          type: "object",
          required: ["pono", "podate"],
          properties: {
            pono: { type: "string" },
            podate: { type: "string", format: "date" }
          }
        }
      },
      purchase_fmcg_details: {
        type: "array",
        items: {
          type: "object",
          required: [
            "product_id",
            "product_code",
            "qty",
            "free_qty",
            "discount_percentage",
            "discount_amount",
            "head_id",
            "category_id",
            "sub_category_id",
            "uom_id",
            "rate",
            "amount",
            "mrp",
            "cess",
            "cess_amt",
            "po_qty",
            "accepted_margin",
            "sale_rate",
            // "warehouse_margin",
            "sales_margin",
            "reason_debit_note_amt",
            "reason_debit_note",
            "return_qty",
            "purchase_batch_details"
          ],
          properties: {
            product_id: { type: "number" },
            product_code: { type: "number" },
            qty: { type: "number" },
            free_qty: { type: "number" },
            discount_percentage: { type: "number" },
            discount_amount: { type: "number" },
            head_id: { type: "number" },
            category_id: { type: "number" },
            sub_category_id: { type: "number" },
            uom_id: { type: "number" },
            rate: { type: "number" },
            amount: { type: "number" },
            mrp: { type: "number" },
            gst: { type: "number" }, // Add this line
            gst_amount: { type: "number" }, // Add this line
            cess: { type: "number" },
            cess_amt: { type: "number" },
            po_qty: { type: "number" },
            accepted_margin: { type: "number" },
            // warehouse_margin: { type: "number" },
            sales_margin: { type: "number" },
            sale_rate: { type: "number" },
            reason_debit_note_amt: { type: "number" },
            reason_debit_note: { type: "string" },
            return_qty: { type: "number" },
            reason_debit_note: { type: "string" }, // ✅ Add this field
            purchase_batch_details: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "batch_no",
                  "qty",
                  "manufacture_date",
                  "expiry_type",
                  "expiry_value",
                  "expiry_date"
                ],
                properties: {
                  batch_no: { type: "string" },
                  qty: { type: "string" },
                  self_life_qty: { type: "string" },
                  return_qty: { type: "string" },
                  manufacture_date: { type: "string", format: "date" },
                  expiry_type: { type: "integer" },
                  expiry_value: { type: "integer" },
                  expiry_date: { type: "string", format: "date" },
                }
              }
            }
          }
        }
      },
      purchase_tray_details: {
        type: "array",
        items: {
          type: "object",
          required: ["tray_id", "tray_count"],
          properties: {
            tray_id: { type: "integer" },
            tray_count: { type: "integer" }
          }
        }
      },
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

module.exports = putPurchaseMasterSchema;
