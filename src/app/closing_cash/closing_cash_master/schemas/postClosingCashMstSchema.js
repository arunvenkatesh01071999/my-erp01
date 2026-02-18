const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingCashMstSchema = {
  tags: ["ClosingCashMaster"],
  summary: "This API is to post ClosingCashMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["date", "total", "outlet_id", "salesman_id"],
    properties: {
      date: { type: "string", },
      total: { type: "number" },
      outlet_id: { type: "integer" },
      salesman_id: { type: "integer" },
      total_invoices: { type: "number" },
      total_sales: { type: "number" },
      total_card: { type: "number" },
      total_cash: { type: "number" },
      total_upi: { type: "number" },
      total_return: { type: "number" },
      total_return_used: { type: "number" },
      total_loyalty: { type: "number" },
      total_return_count: { type: "number" },
      total_less_amount: { type: "number" },
      avg_bills: { type: "number" },
      amount_be_deposited: { type: "number" },
      next_day_balance: { type: "number" },
      closing_cash_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            closing_cash_mst_id: { type: "integer" },
            date: { type: "string" },
            count: { type: "integer" },
            total: { type: "number" },
            outlet_id: { type: "integer" },
            salesman_id: { type: "integer" }
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

module.exports = postClosingCashMstSchema;
