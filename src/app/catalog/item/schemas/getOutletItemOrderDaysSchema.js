const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletItemOrderDaysSchema = {
  tags: ["Outlet Item"],
  summary: "API to fetch outlet items with order-day flags and pagination",
  headers: { $ref: "request-headers#" },
  queryString: {
    type: "object",
    required: ["search"],
    additionalProperties: false,
    properties: {
      search: { type: "string", default: "" }
    },
  },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      supplier_id: { type: "integer" },
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    },
    required: ["outlet_id", "supplier_id", "page_size"],
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
              product_id: { type: "integer" },
              product_code: { type: "string" },
              pro_name: { type: "string" },
              fullname: { type: "string" },
              supplier_name: { type: "string" },
              sunday: { type: "boolean" },
              monday: { type: "boolean" },
              tuesday: { type: "boolean" },
              wednesday: { type: "boolean" },
              thursday: { type: "boolean" },
              friday: { type: "boolean" },
              saturday: { type: "boolean" }
            },
            required: [
              "product_id", "product_code", "pro_name",
              "fullname", "supplier_name",
              "sunday", "monday", "tuesday", "wednesday",
              "thursday", "friday", "saturday"
            ]
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
                page_size: { type: "string" }, // comes as string in your example
                total_pages: { type: "integer" }
              },
              required: ["total", "page", "page_size", "total_pages"]
            }
          },
        },
        meta: { $ref: "response-meta#" }
      },
      ...errorSchemas,
    }
  }
};

module.exports = getOutletItemOrderDaysSchema;
