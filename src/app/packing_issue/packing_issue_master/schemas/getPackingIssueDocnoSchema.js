const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingIssueDocnoSchema = {
  tags: ["PACKING ISSUE"],
  summary: "This API is to get SALES DOCNO",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        Docno: { type: "string" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getPackingIssueDocnoSchema;
