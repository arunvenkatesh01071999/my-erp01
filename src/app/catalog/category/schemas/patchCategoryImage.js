const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const patchCategoryImage = {
  tags: ["CATEGORY"],
  summary: "This API is to replace category images",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      category_id: { type: "string" }
    }
  },
  body: {
    type: "array",
    items: {
      type: "object",
      required: ["media_id"],
      properties: {
        media_id: { type: "string", format: "uuid" },
        position: { type: "number" },
        is_primary_for_store: { type: "boolean" }
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

module.exports = patchCategoryImage;
