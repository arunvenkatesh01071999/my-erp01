const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletSalesMasterSchema = {
  tags: ["OutletSalesMaster"],
  summary: "This API is to post OutletSalesMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "outletid", "amount", "company_id"],
    properties: {
      docno: { type: "string" },
      docdate: { type: "string" },
      salesman_id: { type: "integer" },
      outletid: { type: "integer" },
      amount: { type: "number" },
      subtotal_amount: { type: "number" },
      gst_per: { type: "number" },
      gst_amt: { type: "number" },
      cess_per: { type: "number" },
      cess_amt: { type: "number" },
      roff: { type: "number" },
      mode: {
        type: "string",
        enum: ["cash", "upi", "card"] // Enum constraint for mode field
      },
      is_credit: { type: "integer" },
      company_id: { type: "integer" },
      mobile: { type: "string" },
      party_name: { type: "string" },
      address: { type: "string" },
      gst_in: { type: "string" },
      loyalty_earned: { type: "number" },
      loyalty_redem: { type: "number" },
      balance_points: { type: "number" },
      return_amount: { type: "number" },
      return_billno: { type: "string" },
      less_amount: { type: "number" },
      discount_amount: { type: "number" },
      outlet_sales_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            docno: { type: "string" },
            docdate: { type: "string" }, // date-time
            prodid: { type: "integer" },
            outletid: { type: "integer" },
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



module.exports = {
  postOutletSalesMasterSchema
}

