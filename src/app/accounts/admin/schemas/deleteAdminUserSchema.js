const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletegAdminUserSchema = {
  tags: ["DELETE USERS"],
  summary: "This API is to delete users",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      user_id: { type: "integer" }
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

module.exports = deletegAdminUserSchema;
