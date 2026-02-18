const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putBannerSchema = {
  tags: ["BANNER"],
  summary: "This API is to update banners",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      banner_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: ["banner_name", "banner_image_url", "is_active"],
    properties: {
      banner_name: { type: "string" },
      banner_image_url: { type: "string" },
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

module.exports = putBannerSchema;
