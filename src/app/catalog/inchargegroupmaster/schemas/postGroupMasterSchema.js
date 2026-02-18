const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postGroupMasterSchema = {
  tags: ["GROUPMATSER"],
  summary: "This API is to post group master",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["group_name", "company_id", "is_active"],
    properties: {
      group_name: {
        type: "string"
      },
      is_active: { type: "boolean" },
      company_id: { type: "integer" }
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

module.exports = postGroupMasterSchema;
