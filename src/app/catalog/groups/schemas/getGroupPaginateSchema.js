const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getGroupPaginateSchema = {
  tags: ["GROUP"],
  summary: "This API is to get groups",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
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
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getGroupPaginateSchema;
