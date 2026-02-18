const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postOutletPurchaseMemoTempSchema = {
  tags: ["OUTLET PURCHASE MEMO TEMP"],
  summary: "API to save outlet purchase memo in temp tables",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: [
      "supplier_id",
      "outlet_id",
      "party_invoice_no",
      "party_invoice_date",
      "invoice_amount",
      "pono",
      "podate",
      "purchase_memo_details"
    ],
    properties: {
      op_memo_mst_temp_id: { type: "integer" },
      company_id: { type: "integer" },
      supplier_id: { type: "integer" },
      outlet_id: { type: "integer" },
      warehouse_id: { type: "integer" },

      pono: { type: "string" },
      podate: { type: "string" },

      party_invoice_no: { type: "string" },
      party_invoice_date: { type: "string", format: "date" },
      invoice_amount: { type: "number" },

      image_url: { type: "string", nullable: true },

      purchase_memo_details: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: [
            "product_id",
            "product_code",
            "received_qty",
            "memo_mrp",
            "po_mrp",
            "memo_batch_details"
          ],
          properties: {
            product_id: { type: "integer" },
            product_code: { type: "string" },
            po_order_qty: { type: "number" },
            received_qty: { type: "number" },
            return_qty: { type: "number" },
            free_qty: { type: "number" },
            memo_mrp: { type: "number" },
            po_mrp: { type: "number" },

            memo_batch_details: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: [
                  "batch_no",
                  "qty",
                  "mrp",
                  "expiry_type",
                  "expiry_value",
                  "manufacture_date",
                  "expiry_date"
                ],
                properties: {
                  batch_no: { type: "string" },
                  qty: { type: "number" },
                  mrp: { type: "number" },
                  return_qty: { type: "number" },
                  free_qty: { type: "number" },
                  expiry_type: { type: "integer" },
                  expiry_value: { type: "integer" },

                  manufacture_date: {
                    type: "string",
                    format: "date"
                  },
                  expiry_date: {
                    type: "string",
                    format: "date"
                  }
                }
              }
            }
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
        message: { type: "string" },
        docno: { type: "number" },
        memoMasterTempId: { type: "number" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postOutletPurchaseMemoTempSchema;
