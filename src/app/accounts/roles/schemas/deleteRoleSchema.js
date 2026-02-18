const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteRoleSchema = {
  tags: ["ROLE"],
  summary: "This API is to delete roles",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      role_id: { type: "integer" },
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

module.exports = deleteRoleSchema;
