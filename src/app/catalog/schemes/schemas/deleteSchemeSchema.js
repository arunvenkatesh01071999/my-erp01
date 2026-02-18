const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSchemeSchema = {
  tags: ["OFFER MASTER"],
  summary: "This API is to delete offer master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sid: { type: "integer" }
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

module.exports = deleteSchemeSchema;
