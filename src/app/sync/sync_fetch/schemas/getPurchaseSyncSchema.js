const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseSyncSchema = {
  tags: ["SYNCPURCHASE"],
  summary: "This API gets sync PURCHASE master + details",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["flag", "outlet_id"],
    properties: {
      flag: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        grn_no: { type: "string" },
        master: {
          type: "object",
          properties: {
            grn_no: { type: "string" },
            grn_date: { type: "string" },
            invoice_no: { type: "string" },
            invoice_date: { type: "string" },
            pono: { type: "string" },
            podate: { type: "string" },
            outlet_id: { type: "integer" },
            supplier_customer_code: { type: "string" },
            grand_total_amt: { type: "number" },
            purchase_sync: { type: "integer" },
            down_time: { type: "string" },
            outlet_grn_no: { type: "string" },
            sub_total_amt: { type: "number" },
            memo_invoice_amt: { type: "number" },
            total_debit_note_amount: { type: "number" },
            total_return_amt: { type: "number" },
            total_gst_amt: { type: "number" },
            total_igst_amt: { type: "number" },
            total_cess_amt: { type: "number" },
            discount: { type: "number" }
          }
        },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_purchase_mst_id: { type: "integer" },

              financial_year: { type: "string" },
              grn_no: { type: "string" },
              grn_date: { type: "string" },

              po_no: { type: "string" },

              company_id: { type: "integer" },
              supplier_id: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_name: { type: "string" },
              prod_id: { type: "integer" },
              prod_code: { type: "string" },
              prod_name: { type: "string" },
              product_type: { type: "integer" },
              cat_id: { type: "integer" },
              // category_name: { type: "string" },
              sub_cat_id: { type: "integer" },
              head_id: { type: "integer" },
              type_design_id: { type: "integer" },
              brand_company_name: { type: "string" },
              uom_id: { type: "integer" },
              barcode: { type: "string" },
              hsn_code: { type: "string" },

              qty: { type: "number" },
              received_qty: { type: "number" },
              free_qty: { type: "number" },
              return_qty: { type: "number" },

              temp_rec_qty: { type: "number" },
              temp_grn_return_qty: { type: "number" },

              mrp: { type: "number" },
              sale_rate: { type: "number" },
              purchase_rate: { type: "number" },

              accepted_margin: { type: "number" },
              discount: { type: "number" },
              discount_amount: { type: "number" },

              gst: { type: "number" },
              gst_amount: { type: "number" },
              igst: { type: "number" },
              igst_amount: { type: "number" },
              cgst: { type: "number" },
              sgst: { type: "number" },

              cess: { type: "number" },
              cess_amount: { type: "number" },

              amount: { type: "number" },

              self_life_expiry_days: { type: "integer" },

              purchase: { type: "boolean" },

              created_by: { type: "integer" },
              updated_by: { type: "integer" },

              is_active: { type: "boolean" },

              created_at: { type: "string" },
              updated_at: { type: "string" },

              purchase_sync: { type: "integer" },
              down_time: { type: "string" },
              outlet_grn_batch_details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    outlet_purchase_master_id: { type: "integer" },

                    product_id: { type: "integer" },
                    product_code: { type: "string" },

                    batch_no: { type: "string" },
                    qty: { type: "number" },
                    mrp: { type: "number" },
                    self_life_expiry_days: { type: "integer" },
                    return_qty: { type: "number" },

                    company_id: { type: "integer" },
                    manufacture_date: { type: "string", format: "date" },

                    expiry_id: { type: "integer" },
                    expiry_value: { type: "integer" },
                    expiry_date: { type: "string", format: "date" }
                  }
                }
              }
            }

          }
        },
      }
    },

    ...errorSchemas
  }
};



module.exports = getPurchaseSyncSchema;


