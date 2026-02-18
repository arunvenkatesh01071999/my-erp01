const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const menuListSchema = {
  tags: ["MENU LIST"],
  summary: "This API is to fetch menu list",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          menu_name: { type: "string" },
          menu_icon: { type: "string" },
          menu_url: { type: "string" },
          menu_order: { type: "integer" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
          warehouse_type: { type: "integer" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = menuListSchema;
