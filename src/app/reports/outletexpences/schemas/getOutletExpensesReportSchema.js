const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletExpensesReportSchema = {
  tags: ["OUTLETEXPENCES"],
  summary: "This API is to get Item",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      expenses_name: { type: "integer" },
    }
  },
  body: {
    type: "object",
    properties: {
      from_date: { type: "string" },
      to_date: { type: "string" },
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
          amount: { type: "number" },
          remarks: { type: "string" },
          account_name: { type: "string" },
          cateogory_name: { type: "string" }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletExpensesReportSchema;
