const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const fetchCartCountSchema = {
  tags: ["CART"],
  summary: "This API is used to fetch the Cart Count",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        cart_total_quantity: { type: "number" },
        cart_total_items: { type: "number" },
        cart_total_packing_weight: { type: "number" },
        cart_lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              products_code: { type: "integer" },
              cart_quantity: { type: "number" },
              units_id: { type: "integer" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = fetchCartCountSchema;
