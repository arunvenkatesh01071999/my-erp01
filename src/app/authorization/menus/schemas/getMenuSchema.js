const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getMenuSchema = {
  tags: ["GET MNEUS"],
  summary: "This API is to get menus",
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
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getMenuSchema;
