const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletListSchema = {
  tags: ["OutletList"],
  summary: "This API is to get SalesMan",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          code: { type: "string" },
          short_name: { type: "string" },
          fullname: { type: "string" },
          opening_stock: { type: "number", nullable: true },
          balance_stock: { type: "number", nullable: true },
          min_stock: { type: "number", nullable: true },
          allow_neg_stk: { type: "boolean", nullable: true },
          wscale: { type: "boolean", nullable: true },
          outlet_purchase: { type: "boolean", nullable: true },
          outlet_non_saleable: { type: "boolean", nullable: true },
          local_outlet_purchase: { type: "boolean", nullable: true },
          bankid:{type:'string'}
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletListSchema;
