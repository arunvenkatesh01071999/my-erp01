const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRoleInfoSchema = {
  tags: ["ROLE"],
  summary: "This API is to get roles",
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
        id: { type: "integer" },
        role_name: { type: "string" },
        company_id: { type: "integer" },
        is_outlet: { type: "boolean" },
        is_warehouse: { type: "boolean" },
        is_active: { type: "boolean" },
      }
    },
    ...errorSchemas
  }
};

module.exports = getRoleInfoSchema;
