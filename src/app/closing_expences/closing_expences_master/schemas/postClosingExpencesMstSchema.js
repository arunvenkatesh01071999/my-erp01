const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingExpencesMstSchema = {
  tags: ["ClosingCashMaster"],
  summary: "This API is to post ClosingCashMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["date", "outlet_id", "salesman_id"],
    properties: {
      date: { type: "string", },
      opening_balance: { type: "number" },
      expences_amount: { type: "number" },
      closing_balance: { type: "number" },
      total_amount: { type: "number" },
      outlet_id: { type: "integer" },
      salesman_id: { type: "integer" },
      closing_expences_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            closing_expences_mst_id: { type: "integer" },
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

module.exports = postClosingExpencesMstSchema;
