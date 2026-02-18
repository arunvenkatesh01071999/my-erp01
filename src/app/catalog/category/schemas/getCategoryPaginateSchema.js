const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategoryPaginateSchema = {
  tags: ["CATEGORY"],
  summary: "This API is to fetch categories",
  headers: { $ref: "request-headers#" },
  queryString: {
    type: "object",
    required: ["status", "search"],
    additionalProperties: false,
    properties: {
      status: { type: "integer", enum: [0, 1, 2], default: 0 },
      search: { type: "string", default: "" }
    },
  },
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
              category_name: { type: "string" },
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

module.exports = getCategoryPaginateSchema;
