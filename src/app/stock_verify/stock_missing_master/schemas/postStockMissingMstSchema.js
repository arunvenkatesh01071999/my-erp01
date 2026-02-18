const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesMasterSchema = {
  tags: ["StockMissingMaster"],
  summary: "This API is to post StockMissingMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "partycode", "amount", "company_id", "sales_doc_no"],
    properties: {
      docno: { type: "string" },
      docdate: { type: "string" },
      partycode: { type: "integer" },
      amount: { type: "number" },
      subtotal_amount: { type: "number" },
      gst_per: { type: "number" },
      gst_amt: { type: "number" },
      cess_per: { type: "number" },
      cess_amt: { type: "number" },
      roff: { type: "number" },
      mode: { type: "string" },
      outstanding: { type: "number" },
      company_id: { type: "integer" },
      sales_doc_no: { type: "string" },
      stock_missing_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            docno: { type: "string" },
            docdate: { type: "string" }, // date-time
            prodid: { type: "integer" },
            dis_per: { type: "number" },
            dis_amt: { type: "number" },
            mrp: { type: "number" },
            rate: { type: "number" },
            qty: { type: "number" },
            gst_per: { type: "number" },
            gst_amt: { type: "number" },
            cess_per: { type: "number" },
            cess_amt: { type: "number" },
            barcode: { type: "string" },
            // barcode_to: { type: "string" },
            company_id: { type: "integer" },
            head_id: { type: "integer" },
            type_id: { type: "integer" },
            subcat_id: { type: "integer" },
            cat_id: { type: "integer" },
            uom_id: { type: "integer" },
            igst_per: { type: "number" },
            is_verify: { type: "string" }
          },
        },
      },

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

module.exports = postSalesMasterSchema;
