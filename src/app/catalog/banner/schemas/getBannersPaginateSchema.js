const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBannersPaginateSchema = {
  tags: ["BANNER"],
  summary: "This API is to get banners",
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
              banner_name: { type: "string" },
              banner_image_url: { type: "string" },
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

module.exports = getBannersPaginateSchema;
