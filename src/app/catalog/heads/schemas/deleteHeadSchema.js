const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteHeadSchema = {
  tags: ["HEADS"],
  summary: "This API is to delete Heads",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      head_id: { type: "integer" }
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

module.exports = deleteHeadSchema;
