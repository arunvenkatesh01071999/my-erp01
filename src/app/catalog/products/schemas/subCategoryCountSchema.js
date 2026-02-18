const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const subCategoryCountSchema = {
  tags: ["SUBCATEGORY COUNT"],
  summary:
    "This API is to fetch  count products by subcategories by passing category ",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["category_id"],
    properties: {
      category_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          all: { type: "string" },
          category_id: { type: "integer" },
          count: { type: "integer" },
          id: { type: "integer" },
          subcategory_name: { type: "string" },
          subcategory_image: { type: "string" },
          products_count: { type: "string" }
        }
      }
    },

    ...errorSchemas
  }
};

module.exports = subCategoryCountSchema;
