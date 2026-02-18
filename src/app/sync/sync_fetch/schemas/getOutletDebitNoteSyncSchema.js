const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletDebitNoteSyncSchema = {
  tags: ["SYNC OUTLET DEBIT NOTE"],
  summary: "This API gets sync outlet debit note master + details",
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
            purchase_doc_no: { type: "string" },
            purchase_doc_date: { type: "string" },
            outlet_grn_no: { type: "string" },
            grn_sync_date: { type: "string" },

            outlet_id: { type: "integer" },
            supplier_id: { type: "integer" },
            company_id: { type: "integer" },

            total_invoice_amount: { type: "number" },
            purchase_total_amt: { type: "number" },
            total_debit_note_amount: { type: "number" },

            remark: { type: "string" },
            is_active: { type: "boolean" },
            outlet_debit_note_no: { type: "string" },
            debit_note_sync: { type: "integer" },
            down_time: { type: "string" }
          }
        },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              outlet_debit_note_mst_id: { type: "integer" },
              financial_year: { type: "string" },

              company_id: { type: "integer" },
              supplier_id: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_name: { type: "string" },


              product_id: { type: "integer" },
              product_code: { type: "string" },
              prod_name: { type: "string" },

              qty: { type: "number" },
              mrp: { type: "number" },
              rate: { type: "number" },
              amount: { type: "number" },
              reason: { type: "integer" },

              created_at: { type: "string" },
              updated_at: { type: "string" },

              debit_note_sync: { type: "integer" },
              down_time: { type: "string" },
            }
          }
        },
      }
    },
    ...errorSchemas
  }
};



module.exports = getOutletDebitNoteSyncSchema;


