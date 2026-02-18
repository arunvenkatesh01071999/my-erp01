const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteGroupSchema = {
  tags: ["Group"],
  summary: "This API is to delete groups",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      group_id: { type: "integer" }
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

module.exports = deleteGroupSchema;
