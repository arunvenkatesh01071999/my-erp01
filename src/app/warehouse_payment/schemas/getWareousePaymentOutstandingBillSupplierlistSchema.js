const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postWareousePaymentOutstandingBillSupplierlistSchema = {
  tags: ["HEADS"],
  summary: "This API is to get Outstanding Suppliers",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["warehouse_id"],
    additionalProperties: false,
    properties: {
      warehouse_id: { type: "integer" },
    }
  },

  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          supplier_id: { type: "integer" },
          supplier_name: { type: "string" }
        }
      }
    }
  },

  ...errorSchemas
};


module.exports = postWareousePaymentOutstandingBillSupplierlistSchema;
