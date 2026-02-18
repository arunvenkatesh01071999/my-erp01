const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteBillNoSequenceSchema = {
  tags: ["DELETE BillNoSequence"],
  summary: "This API is to delete BillNoSequence",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteBillNoSequenceSchema;
