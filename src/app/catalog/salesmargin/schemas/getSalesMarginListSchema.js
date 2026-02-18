const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesMarginListSchema = {
  tags: ["SALES MARGIN"],
  summary: "This API retrieves the sales margin list",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: { type: "integer" },
          main_catgory_id: { type: "integer" },
          category_name: { type: "string" },
          brand_id: { type: "integer" },
          brand_name: { type: "string" },
          company_brand_id: { type: "integer" },
          company_brand_name: { type: "string" },
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" },
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
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesMarginListSchema;
