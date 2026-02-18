const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postMenuSchema = {
  tags: ["POST MENU"],
  summary: "This API is to post menu",
  headers: { $ref: "request-headers#" },
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

module.exports = postMenuSchema;
