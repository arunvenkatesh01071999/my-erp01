const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingIssueDocnoSchema = {
  tags: ["PACKING ISSUE"],
  summary: "This API is to get SALES DOCNO",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["docno"],
    properties: {
      docno: { type: "string" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          docno: { type: "string" },
          docdate: { type: "string" },
          wh_id: { type: "integer" },
          total_items: { type: "integer" },
          total_qty: { type: "integer" },
          amount: { type: "number" },
          is_inward: { type: "boolean" },
          warehouse_name: { type: "string" },
          warehouse_short_name: { type: "string" },
          warehouse_add1: { type: "string" },
          warehouse_add2: { type: "string" },
          warehouse_add3: { type: "string" },
          warehouse_add4: { type: "string" },
          packing_issue_details_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                packing_issue_mst_id: { type: "integer" },
                docno: { type: "string" },
                docdate: { type: "string" },
                wh_id: { type: "integer" },
                prod_id: { type: "integer" },
                total_qty: { type: "integer" },
                cat_id: { type: ["integer"] },
                sub_cat_id: { type: ["integer"] },
                head_id: { type: ["integer"] },
                type_design_id: { type: ["integer"] },
                uom_id: { type: ["integer"] },
                barcode: { type: ["string"] },
                pur_rate: { type: ["string"] },
                sale_rate: { type: ["string"] },
                wholesale_rate: { type: ["string"] },
                mrp: { type: ["string"] },
                gst: { type: ["string"] },
                item_product_code: { type: ["string"] },
                item_product_name: { type: ["string"] },
                item_short_name: { type: ["string"] }
              },
              required: [
                "packing_issue_mst_id",
                "docno",
                "docdate",
                "wh_id",
                "prod_id",
                "total_qty"
              ]
            }
          }
        },
        required: [
          "id",
          "docno",
          "docdate",
          "wh_id",
          "total_items",
          "total_qty",
          "amount",
          "is_inward",
          "warehouse_name",
          "warehouse_add1",
          "warehouse_add2",
          "warehouse_add3",
          "warehouse_add4",
          "packing_issue_details_lines"
        ]
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingIssueDocnoSchema;
