const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesMarginNewListSchema = {
  tags: ["SALES MARGIN NEW"],
  summary: "This API retrieves the sales margin new list",
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
          product_code: { type: "string" },
          product_name: { type: "string" },
          weight: { type: "number" },
          cost_price: { type: "number" },
          mrp: { type: "number" },
          gst: { type: "number" },
          cess: { type: "number" },
          cost_before: { type: "number" },
          tax: { type: "number" },
          purchase_cost: { type: "number" },
          transportkg: { type: "number" },
          transport: { type: "number" },
          cover: { type: "number" },
          printing: { type: "number" },
          labour: { type: "number" },
          wastage_percentage: { type: "number" },
          purchase_cost1: { type: "number" },
          warehouse_margin: { type: "number" },
          billing_cost: { type: "number" },
          margin: { type: "number" },
          sale_rate: { type: "number" },
          profit: { type: "number" }
        },
      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesMarginNewListSchema;
