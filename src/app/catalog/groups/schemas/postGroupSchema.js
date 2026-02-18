const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postGroupSchema = {
  tags: ["GROUPS"],
  summary: "This API is to post groups",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["group_name", "group_image", "is_active"],
    properties: {
      group_name: { type: "string" },
      group_image: { type: "string" },
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

module.exports = postGroupSchema;
