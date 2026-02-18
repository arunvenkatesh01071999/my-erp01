const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postProductSchema = {
  tags: ["PRODUCTS"],
  summary: "This API is to post products and variants",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      product_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "product_code",
      "product_short_description",
      "product_long_description",
      "brands_id",
      "groups_id",
      "main_category_id",
      "sub_category_id",
      "stock_status",
      "seller_information",
      "direction_of_usage",
      "safety_information",
      "maufacturar_information",
      "benefits",
      "is_active",
      "variants" // Assuming you have a property for variants
    ],
    properties: {
      product_code: { type: "string" },
      product_short_description: { type: "string" },
      product_long_description: { type: "string" },
      brands_id: { type: "integer" },
      groups_id: { type: "integer" },
      main_category_id: { type: "integer" },
      sub_category_id: { type: "integer" },
      stock_status: { type: "integer" },
      seller_information: { type: "string" },
      direction_of_usage: { type: "string" },
      safety_information: { type: "string" },
      maufacturar_information: { type: "string" },
      benefits: { type: "string" },
      is_active: { type: "boolean" },
      variants: {
        type: "array",
        items: {
          type: "object",
          required: [
            "units_id",
            "mrp",
            "sales_price",
            "discount_percentage",
            "discount_amount",
            "minimum_sales_qty",
            "maximum_sales_qty",
            "stock_status",
            "packing_weight",
            "gst",
            "igst",
            "cess",
            "is_active"
          ],
          properties: {
            units_id: { type: "integer" },
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
            is_active: { type: "boolean" }
          }
        }
      },
      products_images: {
        type: "array",
        items: {
          type: "object",
          required: ["products_image", "is_active"],
          properties: {
            products_image: { type: "string" },
            is_active: { type: "boolean" }
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

module.exports = postProductSchema;
