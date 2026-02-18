const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemPaginateSchema = {
  tags: ["Item"],
  summary: "This API is to get Item",
  headers: { $ref: "request-headers#" },

  response: {
    200: {
      // type: "object",
      // properties: {
      // data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          outlet_id: { type: "integer" },
          outlet: { type: "string" },
          sold_count: { type: "integer" },
          qty: { type: "integer" },
          total: { type: "number" },
          inwarehouse_count: { type: "integer" },
          outlet_mrp_sum: { type: "number" },
          outlet_pur_rate_sum: { type: "number" },
          warehouse_mrp_sum: { type: "number" },
          warehouse_pur_rate_sum: { type: "number" },
          outlet_tax_value: { type: "number" },
          warehouse_tax_value: { type: "number" },

        }
      }
      // },
      // meta: { $ref: "response-meta#" }
      // }
    },
    ...errorSchemas
  }
};

module.exports = getItemPaginateSchema;
