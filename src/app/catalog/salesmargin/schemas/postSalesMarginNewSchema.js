const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSalesMarginNewSchema = {
  tags: ["SALES MARGIN"],
  summary: "This API is to post sales margin new",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["sales_margin_new_details"],
    properties: {
      sales_margin_new_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            product_id: { type: "integer" },
            main_catgory_id: { type: "integer" },
            category_name: { type: "string" },
            brand_id: { type: "integer" },
            brand_name: { type: "string" },
            product_code: { type: "string" },
            product_name: { type: "string" },
            cost_price: { type: "number" },
            sale_rate: { type: "number" },
            mrp: { type: "number" },
            discount: { type: "number" },
            sales_margin: { type: "number" },
            margin: { type: "number" },
            warehouse_margin: { type: "number" },
            gst: { type: "number" },
            cess: { type: "number" },
            accept_margin: { type: "number" },
            grn_margin: { type: "number" }
          },
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

module.exports = postSalesMarginNewSchema;
