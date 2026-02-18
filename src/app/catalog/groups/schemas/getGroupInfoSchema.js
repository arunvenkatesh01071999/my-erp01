const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getGroupInfoSchema = {
  tags: ["GROUP INFO"],
  summary: "This API is to get groups info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      group_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        group_name: { type: "string" },
        group_image: { type: "string" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getGroupInfoSchema;
