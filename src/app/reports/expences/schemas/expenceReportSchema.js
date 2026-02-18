const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getExpensesReportSchema = {
  tags: ["EXPENCES"],
  summary: "This API is to get Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      docno: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          docno: { type: "string" },
          docdate: { type: "string" },
          accid: { type: "integer" },
          amount: { type: "integer" },
          remarks: { type: "string" },
          company_id: { type: "integer" },
          created_at: { type: "string" },
          updated_at: { type: "string" },
          created_by: { type: "integer" },
          cateogory_name: { type: "string" },
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getExpensesReportSchema;
