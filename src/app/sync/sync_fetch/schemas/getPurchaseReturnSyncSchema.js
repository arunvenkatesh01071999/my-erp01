const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseReturnSyncSchema = {
  tags: ["SYNC PURCHASE RETURN"],
  summary: "This API gets sync PURCHASE RETURN master + details",
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
        doc_no: { type: "string" },
        master: {
          type: "object",
          properties: {
            id: { type: "integer" },
            financial_year: { type: "string" },
            doc_no: { type: "string" },
            doc_date: { type: "string" },
            invoice_no: { type: "string" },
            invoice_date: { type: "string" },
            einvoice_no: { type: "string" },
            pono: { type: "string" },
            podate: { type: "string" },
            outlet_id: { type: "integer" },
            supplier_id: { type: "integer" },
            company_id: { type: "integer" },
            supplier_customer_code: { type: "string" },
            memo_no: { type: "string" },
            memo_date: { type: "string" },
            outlet_purchase_no: { type: "string" },
            wh_id: { type: "integer" },
            return_type: { type: "integer" },
            roff: { type: "number" },
            grand_total_amt: { type: "number" },
            sub_total_amt: { type: "number" },
            total_gst_amt: { type: "number" },
            total_igst_amt: { type: "number" },
            total_cess_amt: { type: "number" },
            discount: { type: "number" },
            total_items: { type: "integer" },
            remark: { type: "string" },
            eway: { type: "number" },
            eway_type: { type: "integer" },
            eway_date: { type: "string" },
            eway_valid_date: { type: "string" },
            eway_path: { type: "string" },
            akno: { type: "string" },
            ak_date: { type: "string" },
            irnno: { type: "string" },
            effect_date: { type: "string" },
            is_active: { type: "boolean" },
            outlet_purchase_return_no: { type: "string" },
            return_sync: { type: "integer" },
            down_time: { type: "string" }
          }
        },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_purchase_return_mst_id: { type: "integer" },

              financial_year: { type: "string" },
              doc_no: { type: "string" },
              doc_date: { type: "string" },

              po_no: { type: "string" },
              po_date: { type: "string" },
              memo_no: { type: "string" },
              memo_date: { type: "string" },

              company_id: { type: "integer" },
              supplier_id: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_name: { type: "string" },
              wh_id: { type: "integer" },

              prodid: { type: "integer" },
              pro_code: { type: "string" },
              prod_name: { type: "string" },

              batch_no: { type: "string" },
              expiry_date: { type: "string" },

              accepted_qty: { type: "number" },
              accepted_free_qty: { type: "number" },
              return_qty: { type: "number" },

              return_free_qty: { type: "number" },
              dis_per: { type: "number" },

              dis_amt: { type: "number" },
              rate: { type: "number" },
              amount: { type: "number" },

              mrp: { type: "number" },

              gst: { type: "number" },
              gst_amount: { type: "number" },
              igst: { type: "number" },
              igst_amount: { type: "number" },
              cgst: { type: "number" },
              sgst: { type: "number" },

              cess: { type: "number" },
              cess_amount: { type: "number" },
              reason: { type: "integer" },

              created_at: { type: "string" },
              updated_at: { type: "string" },

              return_sync: { type: "integer" },
              down_time: { type: "string" },
            }
          }
        },
      }
    },
    ...errorSchemas
  }
};



module.exports = getPurchaseReturnSyncSchema;


