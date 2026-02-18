const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingCashWarehouseMstSchema = {
  tags: ["ClosingCash Warehouse Master"],
  summary: "This API is to post ClosingCash Warehouse Master",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["date", "total", "warehouse_id"],
    properties: {
      warehouse_id: { type: "integer" },
      date: { type: "string", },
      total: { type: "number" },
      amount_be_deposited: { type: "number" },
      next_day_balance: { type: "number" },
      closing_cash_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            closing_cash__wh_mst_id: { type: "integer" },
            warehouse_id: { type: "integer" },
            date: { type: "string" },
            count: { type: "integer" },
            total: { type: "number" }
          },
        },
      },

    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        docno: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postClosingCashWarehouseMstSchema;
