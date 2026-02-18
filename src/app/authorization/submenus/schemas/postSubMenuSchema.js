const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSubMenuSchema = {
  tags: ["POST SUBMENU"],
  summary: "This API is to post submenu",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "menu_id",
      "sub_menu_name",
      "sub_menu_url",
      "sub_menu_order",
      "company_id",
      "warehouse_type"
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
      }
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

module.exports = postSubMenuSchema;
