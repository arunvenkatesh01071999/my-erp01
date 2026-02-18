const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const submenuListSchema = {
  tags: ["SUB MENU LIST"],
  summary: "This API is to fetch sub menu list",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          menu_id: { type: "integer" },
          sub_menu_name: { type: "string" },
          sub_menu_url: { type: "string" },
          sub_menu_order: { type: "integer" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          created_by: { type: "integer" },
          updated_by: { type: "integer" }
        }
      },
      meta: { $ref: "response-meta#" }
    },

    ...errorSchemas
  }
};

module.exports = submenuListSchema;
