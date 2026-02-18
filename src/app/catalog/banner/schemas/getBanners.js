const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBannersSchema = {
  tags: ["BANNER"],
  summary: "This API is to get banners",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
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
    ...errorSchemas
  }
};

module.exports = getBannersSchema;
