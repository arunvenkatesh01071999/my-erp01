const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingInwardDocnoSchema = {
  tags: ["PACKING ISSUE"],
  summary: "This API is to get packing issue details",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          docno: { type: "string" }
        },
      },
    },
    ...errorSchemas,
  },
};

module.exports = getPackingInwardDocnoSchema;
