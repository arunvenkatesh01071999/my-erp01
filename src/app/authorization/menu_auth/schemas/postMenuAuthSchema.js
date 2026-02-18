const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postMenuAuthSchema = {
  tags: ["POST MENUAUTH"],
  summary: "This API is to post menuauth",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["user_id", "menu_auth_details"],
    properties: {
      user_id: { type: "integer" },
      menu_auth_details: {
        type: "array",
        items: {
          type: "object",
          required: ["menu_id", "submenu_id", "company_id"],
          properties: {
            menu_id: { type: "integer" },
            submenu_id: { type: "integer" },
            company_id: { type: "integer" },
            view: { type: "boolean", default: false },
            save: { type: "boolean", default: false },
            edit: { type: "boolean", default: false },
            delete: { type: "boolean", default: false }
          }
        }
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

module.exports = postMenuAuthSchema;
