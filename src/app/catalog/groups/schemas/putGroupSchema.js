const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putGroupSchema = {
  tags: ["Group"],
  summary: "This API is to update groups",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      group_id: { type: "integer" }
    }
  },
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

module.exports = putGroupSchema;
