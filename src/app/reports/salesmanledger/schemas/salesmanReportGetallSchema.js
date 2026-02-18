const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const salesmanReportSchema = {
  tags: ["Salesman Report Get all"],
  summary: "This API is to get salesman  report Get all",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["from_date", "to_date"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sales_man_code: { type: 'string' },
          sales_man_name: { type: 'string' },
          salesman_id: { type: 'number' },
          total_bills: { type: 'string' },
          sales: { type: 'string' },
          return: { type: 'string' },
          avg_bills: { type: 'string' },
          fullname: { type: 'string' }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = salesmanReportSchema;
