const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const orderItemsSalesSchema = {
  tags: ["ITEM WISE SALES"],
  summary: "This API is to get item wise sales",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["from_date", "to_date"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        grandTotal: { type: "number" },
        totalQuantity: { type: "number" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              product_long_description: { type: "string" },
              product_short_description: { type: "string" },
              units_long_name: { type: "string" },
              units_short_name: { type: "string" },
              total: { type: "number" },
              quantity: { type: "number" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = orderItemsSalesSchema;
