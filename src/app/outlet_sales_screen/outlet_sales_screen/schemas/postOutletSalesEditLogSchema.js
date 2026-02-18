const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletSalesEditLogSchema = {
  tags: ["OutletSalesEditLog"],
  summary: "This API is to post OutletSalesEditLog",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["barcode", "pro_id", "outlet_id", "sales_man_id"],
    properties: {

      barcode: { type: "string", },
      pro_id: { type: "integer" },
      outlet_id: { type: "integer" },
      pro_name: { type: "string" },
      sales_man_id: { type: "integer" },
      sales_man_name: { type: "string" },
      bill_no: { type: "string" },
      mrp: { type: "number" },
      qty: { type: "number" },


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

module.exports = postOutletSalesEditLogSchema;
