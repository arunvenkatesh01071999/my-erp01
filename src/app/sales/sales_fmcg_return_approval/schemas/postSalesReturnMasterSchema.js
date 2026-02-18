const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesMasterSchema = {
  tags: ["SalesMaster"],
  summary: "This API is to post SalesMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "partycode", "amount", "company_id"],
    properties: {
      docdate: { type: "string" },
      partycode: { type: "integer" },
      amount: { type: "number" },
      subtotal_amount: { type: "number" },
      gst_per: { type: "number" },
      gst_amt: { type: "number" },
      cess_per: { type: "number" },
      cess_amt: { type: "number" },
      roff: { type: "number" },
      billno: { type: "string" },
      mode: { type: "string" },
      company_id: { type: "integer" },
      sales_return_details: {
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
            company_id: { type: "integer" },
            head_id: { type: "integer" },
            type_id: { type: "integer" },
            subcat_id: { type: "integer" },
            cat_id: { type: "integer" },
            uom_id: { type: "integer" },
            igst_per: { type: "number" },
          },
        },
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

module.exports = postSalesMasterSchema;
