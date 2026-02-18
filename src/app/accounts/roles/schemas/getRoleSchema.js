const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRoleSchema = {
  tags: ["ROLE"],
  summary: "This API is to get roles",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              role_name: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" },
              is_outlet: { type: "boolean" },
              is_warehouse: { type: "boolean" },
              warehouse_type: { type: "integer" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getRoleSchema;
