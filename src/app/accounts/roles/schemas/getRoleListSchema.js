const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRoleListSchema = {
  tags: ["RoleList"],
  summary: "This API is to get SalesMan",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      page_size: { type: "integer" },
      current_page: { type: "integer" },
      warehouse_type: { type: "integer", enum: [0, 1, 2] },// warehouse = 1 , outlet = 0 
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          role_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
          is_outlet: { type: "boolean" },
          is_warehouse: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getRoleListSchema;
