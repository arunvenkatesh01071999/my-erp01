const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOrderSchema = {
  tags: ["ORDERS"],
  summary: "This API is to get customers orders",
  headers: { $ref: "request-headers#" },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          address_id: { type: "integer" },
          address_type: { type: "string" },
          address_line1: { type: "string" },
          address_line2: { type: "string" },
          address_line3: { type: "string" },
          orders_total: { type: "number" },
          orders_discount_amount: { type: "number" },
          orders_no_of_items: { type: "number" },
          orders_items_qty: { type: "number" },
          orders_weight: { type: "number" },
          orders_delivery_charge: { type: "number" },
          orders_type: { type: "string" },
          orders_mode: { type: "string" },
          orders_status: { type: "integer" },
          orders_status_text: { type: "string" },
          orders_transactions_id: { type: "string" },
          orders_action_date: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          order_lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                orders_id: { type: "integer" },
                orders_items_total: { type: "number" },
                orders_items_discount: { type: "number" },
                products_code: { type: "string" },
                product_short_description: { type: "string" },
                product_long_description: { type: "string" },
                products_image: { type: "string" },
                units_id: { type: "integer" },
                units_short_name: { type: "string" },
                units_long_name: { type: "string" },
                orders_quantity: { type: "number" },
                orders_rate: { type: "number" },
                orders_gst: { type: "number" },
                orders_igst: { type: "number" },
                orders_cess: { type: "number" },
                created_at: { type: "string", format: "date-time" },
                updated_at: { type: "string", format: "date-time" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOrderSchema;
