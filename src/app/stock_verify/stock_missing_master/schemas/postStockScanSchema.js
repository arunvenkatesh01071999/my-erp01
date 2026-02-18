const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postStockScanSchema = {
  tags: ["Stock Scan"],
  summary: "This API is to post Stock Scan",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["barcode", "docno"],
    properties: {
      docno: { type: "string" },
      docdate: { type: "string" },
      barcode: { type: "string" },
      pro_code: { type: "string" },
      description: { type: "string" },
      mrp: { type: "number" },
      gst_per: { type: "number" },
      rate: { type: "number" },
      dis_per: { type: "number" },
      qty: { type: "number" },
      gst_amt: { type: "number" },
      amount: { type: "number" },
      sales_details_id: { type: "integer" }
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

module.exports = postStockScanSchema;
