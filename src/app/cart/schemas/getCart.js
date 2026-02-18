const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getCartSchema = {
  tags: ["CART"],
  summary: "This API is used for Get Cart Info",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        cart_total: { type: "number" },
        cart_total_savings: { type: "number" },
        cart_total_quantity: { type: "number" },
        cart_total_items: { type: "number" },
        cart_total_packing_weight: { type: "number" },
        cart_lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              products_code: { type: "integer" },
              product_short_description: { type: "string" },
              product_long_description: { type: "string" },
              cart_quantity: { type: "number" },
              products_active: { type: "boolean" },
              products_variants_active: { type: "boolean" },
              products_stock_status: { type: "integer" },
              cart_items_total: { type: "number" },
              cart_items_total_savings: { type: "number" },
              mrp: { type: "number" },
              sales_price: { type: "number" },
              discount_percentage: { type: "number" },
              minimum_sales_qty: { type: "number" },
              maximum_sales_qty: { type: "number" },
              units_id: { type: "integer" },
              units_name: { type: "string" },
              gst: { type: "number" },
              igst: { type: "number" },
              cess: { type: "number" },
              packing_weight: { type: "number" },
              products_images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    products_image: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCartSchema;
