const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postOutletPurchaseReturnSchema = {
  tags: ["PURCHASE RETURN"],
  summary: "API to create outlet purchase return",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: [
      "docdate",
      "supplier_id",
      "outlet_id",
      "company_id",
      "type",
      "total_amount",
      "discount_amount",
      "grand_total",
      "roff",
      "outlet_purchase_return_details",
      "invoice_no",
      "invoice_date"
    ],

    properties: {
      /* ===== MASTER ===== */
      docdate: { type: "string", format: "date" },

      invoice_no: { type: "string" },
      invoice_date: { type: "string", format: "date" },

      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      company_id: { type: "integer" },

      type: { type: "integer", enum: [1, 2] }, 
      // 1 = IGST, 2 = GST (as per your code)

      total_amount: { type: "number" },
      discount_amount: { type: "number", default: 0 },
      grand_total: { type: "number" },
      roff: { type: "number", default: 0 },

      igst: { type: "number", default: 0 },
      cess_amt: { type: "number", default: 0 },

      remark: { type: "string" },

      /* ===== DETAILS ===== */
      outlet_purchase_return_details: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: [
            "product_id",
            "product_code",
            "return_qty",
            "rate",
            "amount",
            "mrp",
            "igst",
            "reason"
          ],

          properties: {
            product_id: { type: "integer" },
            product_code: { type: "string" },

            batch_no: { type: "string" },
            expiry_date: { type: "string", format: "date" },

            accepted_qty: { type: "number", default: 0 },
            accepted_free_qty: { type: "number", default: 0 },

            return_qty: { type: "number" },
            return_free_qty: { type: "number", default: 0 },

            discount_percentage: { type: "number", default: 0 },
            discount_amount: { type: "number", default: 0 },

            rate: { type: "number" },
            amount: { type: "number" },
            mrp: { type: "number" },

            igst: { type: "number", default: 0 },

            cess: { type: "number", default: 0 },
            cess_amt: { type: "number", default: 0 },

            reason: { type: "string" }
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

module.exports = postOutletPurchaseReturnSchema;
