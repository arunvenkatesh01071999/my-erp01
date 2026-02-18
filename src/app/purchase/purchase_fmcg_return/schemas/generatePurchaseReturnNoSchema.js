const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPurchaseReturnNoSchema = {
  tags: ["GENERATE PURCHASE RETURN  NO"],
  summary: "This API is to get purchase return docno",
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

module.exports = getPurchaseReturnNoSchema;
