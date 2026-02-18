const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSubMenuSchema = {
  tags: ["SUBMENU UPDATION"],
  summary: "This API is to submenu updation",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      submenu_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "menu_id",
      "sub_menu_name",
      "sub_menu_url",
      "sub_menu_order",
      "company_id",
      "warehouse_type",
      "is_active"
    ],
    properties: {
      menu_id: { type: "integer" },
      sub_menu_name: { type: "string" },
      sub_menu_url: { type: "string" },
      sub_menu_order: { type: "integer" },
      company_id: { type: "integer" },
      warehouse_type: {
        type: "integer",
        enum: [0, 1, 2]
      },
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

module.exports = putSubMenuSchema;
