const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseDetailsSchema = {
  tags: ["OUTLET PURCHASE DETAILS"],
  summary: "API to get outlet purchase details with item & batch info",
  headers: { $ref: "request-headers#" },

  response: {
    200: {
      type: "object",
      required: [
        "regionDetails",
        "outletDetails",
        "supplierDetails",
        "poDetails",
        "doc_no",
        "doc_date",
        "invoice_no",
        "invoice_date",
        "sub_total_amt",
        "total_gst_amt",
        "total_igst_amt",
        "total_cess_amt",
        "discount",
        "tcs",
        "fright_charges",
        "other_charges",
        "roff",
        "grand_total_amt",
        "remark",
        "return_remark",
        "item_details"
      ],

      properties: {
        regionDetails: {
          type: "object",
          required: ["id", "region_name"],
          properties: {
            id: { type: "integer" },
            region_name: { type: "string" }
          }
        },

        outletDetails: {
          type: "object",
          required: ["id", "outlet_full_name", "outlet_short_name"],
          properties: {
            id: { type: "integer" },
            outlet_full_name: { type: "string" },
            outlet_short_name: { type: "string" }
          }
        },

        supplierDetails: {
          type: "object",
          required: [
            "id",
            "supplier_name",
            "short_name",
            "supplier_balance",
            "supplier_gstin",
            "gst_type"
          ],
          properties: {
            id: { type: "integer" },
            supplier_name: { type: "string" },
            short_name: { type: "string" },
            add1: { type: "string" },
            add2: { type: "string" },
            supplier_balance: { type: "number" },
            supplier_gstin: { type: "string" },
            supplier_mobile_no: { type: "string" },
            supplier_bank_ac_no: { type: "string" },
            gst_type: { type: "integer" }
          }
        },
        poDetails: {
          type: "object",
          required: [
            "id",
            "pono",
            "podate",
            "memo_no",
            "memo_date"
          ],
          properties: {
            id: { type: "integer" },
            pono: { type: "string" },
            podate: { type: "string", format: "date" },
            memo_no: { type: "string" },
            memo_date: { type: "string", format: "date" }
          }
        },
        doc_no: { type: "string" },
        doc_date: { type: "string", format: "date" },
        invoice_no: { type: "string" },
        invoice_date: { type: "string", format: "date" },

        sub_total_amt: { type: "number" },
        total_gst_amt: { type: "number" },
        total_igst_amt: { type: "number" },
        total_cess_amt: { type: "number" },
        discount: { type: "number" },
        tcs: { type: "number" },
        fright_charges: { type: "number" },
        other_charges: { type: "number" },
        roff: { type: "number" },
        grand_total_amt: { type: "number" },

        remark: { type: "string" },
        return_remark: { type: "string" },

        item_details: {
          type: "array",
          items: {
            type: "object",
            required: [
              "product_id",
              "product_code",
              "product_name",
              "units_short_name",
              "hsn_code",
              "mrp",
              "discount",
              "gst",
              "cess",
              "gst_amount",
              "cess_amount",
              "purchase_rate",
              "accepted_margin",
              "sale_rate",
              "qty",
              "free_qty",
              "amount",
              "igst",
              "igst_amount",
              "cgst",
              "sgst",
              "discount_amount",
              "item_batch_details"
            ],

            properties: {
              product_id: { type: "integer" },
              product_code: { type: "string" },
              product_name: { type: "string" },
              units_short_name: { type: "string" },
              hsn_code: { type: "string" },

              mrp: { type: "number" },
              discount: { type: "number" },
              gst: { type: "number" },
              cess: { type: "number" },
              gst_amount: { type: "number" },
              cess_amount: { type: "number" },

              purchase_rate: { type: "number" },
              accepted_margin: { type: "number" },
              sale_rate: { type: "number" },

              qty: { type: "number" },
              free_qty: { type: "number" },
              amount: { type: "number" },

              igst: { type: "number" },
              igst_amount: { type: "number" },
              cgst: { type: "number" },
              sgst: { type: "number" },

              discount_amount: { type: "number" },

              item_batch_details: {
                type: "array",
                items: {
                  type: "object",
                  required: [
                    "batch_no",
                    "expiry_date",
                    "manufacture_date"
                  ],
                  properties: {
                    batch_no: { type: "string" },
                    expiry_date: { type: "string", format: "date" },
                    manufacture_date: { type: "string", format: "date" }
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

module.exports = getOutletPurchaseDetailsSchema;
