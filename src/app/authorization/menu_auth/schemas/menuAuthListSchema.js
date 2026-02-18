const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const menuListSchema = {
  tags: ["MENU AUTH LIST"],
  summary: "This API is to fetch menu auth list",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      user_id: { type: "integer" },
      warehouse_type: { type: "integer", enum: [0, 1, 2] } // 1 warehouse, 0 outlet
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          menu_id: { type: "integer" },
          text: { type: "string" }, // ✅ Changed from menu_name to text
          icon: { type: "string" }, // ✅ Changed from menu_icon to icon
          path: { type: "string" }, // ✅ Changed from menu_url to path
          submenus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                submenu_id: { type: "integer" },
                text: { type: "string" }, // ✅ Changed from sub_menu_name to text
                path: { type: "string" }, // ✅ Changed from sub_menu_url to path
                permission: { // ✅ Updated permission as array of strings
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["view", "save", "edit", "delete"]
                  }
                }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = menuListSchema;
