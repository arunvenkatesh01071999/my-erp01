const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getProductByBrandSchema = {
  tags: ["PRODUCTS"],
  summary: "This API is to get products by brands",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      brand_id: { type: "integer" },
      page_size: { type: "integer" },
      current_page: { type: "integer" }
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
              product_code: { type: "string" },
              product_short_description: { type: "string" },
              product_long_description: { type: "string" },
              brands_id: { type: "integer" },
              brand_name: { type: "string" },
              groups_id: { type: "integer" },
              group_name: { type: "string" },
              main_category_id: { type: "integer" },
              category_name: { type: "string" },
              sub_category_id: { type: "integer" },
              subcategory_name: { type: "string" },
              stock_status: { type: "integer" },
              seller_information: { type: "string" },
              direction_of_usage: { type: "string" },
              safety_information: { type: "string" },
              maufacturar_information: { type: "string" },
              benefits: { type: "string" },
              is_active: { type: "boolean" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              variants_count: { type: "integer" },
              variants: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    products_id: { type: "integer" },
                    products_code: { type: "string" },
                    units_id: { type: "integer" },
                    units_short_name: { type: "string" },
                    units_long_name: { type: "string" },
                    mrp: { type: "number" },
                    sales_price: { type: "number" },
                    discount_percentage: { type: "number" },
                    discount_amount: { type: "number" },
                    minimum_sales_qty: { type: "number" },
                    maximum_sales_qty: { type: "number" },
                    stock_status: { type: "integer" },
                    packing_weight: { type: "number" },
                    gst: { type: "number" },
                    igst: { type: "number" },
                    cess: { type: "number" },
                    is_active: { type: "boolean" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                  }
                }
              },
              product_images: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    products_code: { type: "string" },
                    products_image: { type: "string" },
                    is_active: { type: "boolean" }
                  }
                }
              }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getProductByBrandSchema;
