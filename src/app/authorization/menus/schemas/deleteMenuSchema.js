const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteMenuSchema = {
  tags: ["DELETE MENUS"],
  summary: "This API is to delete menus",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      menu_id: { type: "integer" }
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

module.exports = deleteMenuSchema;
