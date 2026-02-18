const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseItemListSchema = {
  tags: ["GRN PO ITEMS"],
  summary: "API to list GRN PO items with batch details",
  headers: { $ref: "request-headers#" },

  body: {
    type: "array",
    minItems: 1,
    items: {
      type: "object",
      required: ["pono", "memo_no"],
      properties: {
        pono: { type: "string" },
        memo_no: { type: "string" }
      },
      additionalProperties: false
    }
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        required: [
          "memo_no",
          "grand_total_amt",
          "sub_total_amt",
          "invoice_no",
          "invoice_date",
          "total_order_qty",
          "total_received_qty",
          "remark",
          "return_mount",
          "retrun_remark",
          "discount",
          "roff",
          "other_charges",
          "total_gst_amt",
          "total_igst_amt",
          "total_cess_amt",
          "advance",
          "tcs",
          "items"
        ],

        properties: {
          memo_no: { type: "string" },
          grand_total_amt: { type: "string" },
          sub_total_amt: { type: "string" },
          invoice_no: { type: "string" },
          invoice_date: { type: "string" },
          total_order_qty: { type: "number" },
          total_received_qty: { type: "number" },
          remark: { type: "number" },
          return_mount: { type: "string" },
          retrun_remark: { type: "number" },
          discount: { type: "string" },
          roff: { type: "string" },
          other_charges: { type: "string" },
          total_gst_amt: { type: "string" },
          total_igst_amt: { type: "string" },
          total_cess_amt: { type: "string" },
          advance: { type: "string" },
          tcs: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              required: [
                "product_id",
                "product_code",
                "pro_name",
                "barcode",
                "hsn_code",
                "discount",
                "discount_amount",
                "purchase_rate",
                "amount",
                "accepted_margin",
                "sale_rate",
                "gst",
                "gst_amount",
                "igst",
                "igst_amount",
                "cgst",
                "sgst",
                "cess",
                "cess_amount",
                "order_qty",
                "recived_qty",
                "mrp",
                "po_mrp",
                "uom_id",
                "units_short_name",
                "margin",
                "sales_margin",
                "batch_details"
              ],

              properties: {
                product_id: { type: "number" },
                product_code: { type: "string" },
                pro_name: { type: "string" },
                margin: { type: "string" },
                sales_margin: { type: "string" },
                barcode: { type: "string" },
                hsn_code: { type: "string" },
                discount: { type: "string" },
                discount_amount: { type: "string" },
                purchase_rate: { type: "string" },
                amount: { type: "string" },
                accepted_margin: { type: "string" },
                sale_rate: { type: "string" },
                gst: { type: "string" },
                gst_amount: { type: "string" },
                igst: { type: "string" },
                igst_amount: { type: "string" },
                cgst: { type: "string" },
                sgst: { type: "string" },
                cess: { type: "string" },
                cess_amount: { type: "string" },
                order_qty: { type: "string" },
                recived_qty: { type: "string" },
                mrp: { type: "string" },
                po_mrp: { type: "string" },
                uom_id: { type: "number" },
                units_short_name: { type: "string" },
                margin: { type: "number" },
                sales_margin: { type: "number" },
                batch_details: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["batch_no", "mrp", "qty", "expiry_date", "manufacture_date"],
                    properties: {
                      batch_no: { type: "string" },
                      mrp: { type: "string" },
                      qty: { type: "number" },
                      expiry_date: { type: "string" },
                      manufacture_date: { type: "string" }
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

module.exports = getOutletPurchaseItemListSchema;
