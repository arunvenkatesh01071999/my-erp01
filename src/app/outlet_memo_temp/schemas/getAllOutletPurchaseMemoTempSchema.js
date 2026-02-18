const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getAllOutletPurchaseMemoTempListSchema = {
  tags: ["OUTLET PURCHASE MEMO TEMP"],
  summary: "API to get outlet-wise purchase memo temp list",
  headers: { $ref: "request-headers#" },

  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" }

    },
    required: ["outlet_id"]
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        required: [
          "memo_no",
          "memo_date",
          "pono",
          "podate",
          "party_invoice_no",
          "party_invoice_date",
          "invoice_amount",
          "image_url",
          "outlet_name",
          "supplier_id",
          "supplier_name",
          "user_name",
          "purchase_memo_details"
        ],
        properties: {
          memo_no: { type: "string" },
          memo_date: { type: "string", format: "date" },
          pono: { type: "string" },
          podate: { type: "string", format: "date" },
          party_invoice_no: { type: "string" },
          party_invoice_date: { type: "string", format: "date" },
          invoice_amount: {
            type: ["string", "number"]
          },
          image_url: {
            type: ["string", "null"]
          },

          outlet_name: {
            type: ["string", "null"]
          },
          supplier_id: {
            type: "number"
          },
          supplier_name: {
            type: ["string", "null"]
          },
          user_name: {
            type: ["string", "null"]
          },

          purchase_memo_details: {
            type: "array",
            items: {
              type: "object",
              required: [
                "product_id",
                "product_code",
                "po_order_qty",
                "received_qty",
                "total_qty",
                "memo_mrp",
                "po_mrp",
                "memo_batch_details"
              ],
              properties: {
                product_id: { type: "number" },
                product_code: { type: "string" },

                po_order_qty: { type: ["string", "number"] },
                received_qty: { type: ["string", "number"] },
                free_qty: { type: ["string", "number"] },
                return_qty: { type: ["string", "number"] },
                total_qty: { type: ["string", "number"] },
                memo_mrp: { type: ["string", "number"] },
                po_mrp: { type: ["string", "number"] },

                product_name: {
                  type: ["string", "null"]
                },
                uom_id: { type: "integer" },
                uom_name: {
                  type: ["string", "null"]
                },

                memo_batch_details: {
                  type: "array",
                  items: {
                    type: "object",
                    required: [
                      "product_id",
                      "batch_no",
                      "qty",
                      "mrp"
                    ],
                    properties: {
                      product_id: { type: "number" },
                      batch_no: { type: "string" },

                      qty: { type: ["string", "number"] },
                      mrp: { type: ["string", "number"] },
                      free_qty: { type: ["string", "number"] },
                      return_qty: { type: ["string", "number"] },
                      expiry_type: { type: ["string", "number"] },
                      expiry_value: { type: ["string", "number"] },
                      expiry_date: {
                        type: ["string", "null"],
                        format: "date"
                      },
                      manufacture_date: {
                        type: ["string", "null"],
                        format: "date"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = getAllOutletPurchaseMemoTempListSchema;
