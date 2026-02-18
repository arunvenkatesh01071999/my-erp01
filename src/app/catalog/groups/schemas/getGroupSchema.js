const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getGroupSchema = {
  tags: ["GROUP"],
  summary: "This API is to get groups",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          group_name: { type: "string" },
          group_image: { type: "string" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getGroupSchema;
