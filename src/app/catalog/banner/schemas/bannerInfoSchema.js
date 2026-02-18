const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const bannerInfoSchema = {
  tags: ["BANNER INFO"],
  summary: "This API is to get banners info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      banner_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        banner_name: { type: "string" },
        banner_image_url: { type: "string" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = bannerInfoSchema;
