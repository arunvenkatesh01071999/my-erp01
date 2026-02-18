const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteBannerSchema = {
  tags: ["Banner"],
  summary: "This API is to delete banners",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteBannerSchema;
