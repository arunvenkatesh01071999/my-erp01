const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteGroupMasterSchema = {
  tags: ["GROUPMASTER"],
  summary: "This API is to delete group master",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      inchargegroupmaster_id: { type: "integer" }
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

module.exports = deleteGroupMasterSchema;
