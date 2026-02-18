const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderProductMinStockSchema = {
  tags: ["CONSUMER"],
  summary: "This API retrieves products with minimum stock for an outlet",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              pro_code: { type: "string" },
              pro_name: { type: "string" },
              short_name: { type: "string" },
              pur_rate: { type: "string" },
              sale_rate: { type: "string" },
              wholesale_rate: { type: "string" },
              mrp: { type: "string" },
              gst: { type: "string" },
              cess: { type: "string" },
              hsn: { type: "string" },
              op_stk: { type: "string" },
              balance: { type: "string" },
              min_stock: { type: "string" },
              allow_neg_stk: { type: "boolean" },
              wscale: { type: "boolean" },
              cat_id: { type: "integer" },
              sub_cat: { type: "integer" },
              type: { type: "integer" },
              head_id: { type: "integer" },
              uom: { type: "integer" },
              discount: { type: "string" },
              pro_description: { type: "string" },
              product_type: { type: "string" },
              main_product_id: { type: "integer" },
              main_uom_id: { type: "integer" },
              convertion_factor: { type: "string" },
              main_product_qty: { type: "integer" },
              outlet_id: { type: "integer" },
              outlet_opening_stock: { type: "string" },
              outlet_balance_stock: { type: "string" },
              outlet_min_stock: { type: "string" },
              outlet_allow_neg_stock: { type: "boolean" },
              outlet_wscale: { type: "boolean" },
              outlet_min_warn_stock: { type: ["boolean", "null"] },
              order_qty: { type: "number", nullable: true }

            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer" },
                page: { type: "integer" },
                page_size: { type: "string" },
                total_pages: { type: "integer" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getIndentOrderProductMinStockSchema;
