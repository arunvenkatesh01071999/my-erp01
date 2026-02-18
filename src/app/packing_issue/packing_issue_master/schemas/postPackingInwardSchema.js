const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPackingInwardSchema = {
  tags: ["PackingIssue"],
  summary: "This API is to post a Packing Issue",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docdate", "pack_issue_id", "wh_id", "total_items", "total_qty", "packing_inward_details"],
    properties: {
      docdate: { type: "string" },
      pack_issue_id: { type: "integer" },
      wh_id: { type: "integer" },
      total_items: { type: "integer" },
      total_qty: { type: "integer" },
      packing_inward_details: {
        type: "array",
        items: {
          type: "object",
          required: ["docdate", "prod_id", "total_qty", "cat_id", "sub_cat_id", "head_id", "type_design_id", "uom_id", "pur_rate",
            "sale_rate", "wholesale_rate", "mrp", "gst"],
          properties: {
            docdate: { type: "string" },
            prod_id: { type: "integer" },
            total_qty: { type: "integer" },
            cat_id: { type: "integer" },
            sub_cat_id: { type: "integer" },
            head_id: { type: "integer" },
            type_design_id: { type: "integer" },
            uom_id: { type: "integer" },
            barcode: { type: "string" },
            pur_rate: { type: "number" },
            sale_rate: { type: "number" },
            wholesale_rate: { type: "number" },
            mrp: { type: "number" },
            gst: { type: "number" }
          }
        }
      }
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

module.exports = postPackingInwardSchema;
