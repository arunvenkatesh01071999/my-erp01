const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteSubMenuSchema = {
  tags: ["DELETE SUBMENUS"],
  summary: "This API is to delete sub menus",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      submenu_id: { type: "integer" }
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

module.exports = deleteSubMenuSchema;
