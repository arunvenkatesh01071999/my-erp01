const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putMenuSchema = {
  tags: ["MENU UPDATION"],
  summary: "This API is to menu updation",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      menu_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "menu_name",
      "menu_icon",
      "menu_url",
      "menu_order",
      "company_id",
      "warehouse_type"
    ],
    properties: {
      menu_name: { type: "string" },
      menu_icon: { type: "string" },
      menu_url: { type: "string" },
      menu_order: { type: "string" },
      company_id: { type: "integer" },
      warehouse_type: { type: "integer" },
      is_active: { type: "boolean" }
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

module.exports = putMenuSchema;
