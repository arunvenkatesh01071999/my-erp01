const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getRolePermissionListSchema = {
  tags: ["MENU AUTH LIST"],
  summary: "This API is to fetch menu auth list",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      role_id: { type: "integer" },
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
          menu_name: { type: "string" }, // ✅ Changed from menu_name to text
          view: { type: "boolean" },
          save: { type: "boolean" },
          edit: { type: "boolean" },
          delete: { type: "boolean" },
          submenus: {
            type: "array",
            items: {
              type: "object",
              properties: {
                submenu_id: { type: "integer" },
                sub_menu_name: { type: "string" }, // ✅ Changed from sub_menu_name to text
                permission: { // ✅ Added permission object
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      view: { type: "boolean" },
                      save: { type: "boolean" },
                      edit: { type: "boolean" },
                      delete: { type: "boolean" }
                    }
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

module.exports = getRolePermissionListSchema;
