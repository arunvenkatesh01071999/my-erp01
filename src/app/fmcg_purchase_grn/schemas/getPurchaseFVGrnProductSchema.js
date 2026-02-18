const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getPurchaseFVGrnProductSchema = {
  tags: ["PURCHASE FV GRN PRODUCT SCHEMA"],
  summary: "This API is to get a purchase GRN product schema",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["product_code"],
    properties: {
      product_code: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        product_id: { type: "integer" },
        prod_code: { type: "string" },
        category_id: { type: "integer" },
        sub_category_id: { type: "integer" },
        head_id: { type: "integer" },
        type_design_id: { type: "integer" },
        uom_id: { type: "integer" },
        mrp: { type: "number" },
        gst_per: { type: "number" },
        cess_per: { type: "number" },
        pur_rate: { type: "number" },
        barcode: { type: "string" },
        igst: { type: "string" },
        qty: { type: "number" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPurchaseFVGrnProductSchema;
