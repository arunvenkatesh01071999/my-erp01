const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postClosingExpencesWhMstSchema = {
  tags: ["ClosingCashMaster"],
  summary: "This API is to post ClosingCashMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["date"],
    properties: {
      date: { type: "string" },
      warehouse_id: { type: "integer" },
      salesman_id: { type: "integer" },
      opening_balance: { type: "number" },
      expences_amount: { type: "number" },
      closing_balance: { type: "number" },
      total_amount: { type: "number" },
      closing_expences_wh_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            closing_expences_wh_mst_id: { type: "integer" },
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

module.exports = postClosingExpencesWhMstSchema;
