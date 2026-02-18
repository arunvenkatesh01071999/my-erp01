const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOfferTypeSchema = {
  tags: ["OfferType"],
  summary: "This API is to post OfferType",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "oname",
      "company_id",
      "is_active"
    ],
    properties: {
      oname: { type: "string" },
      is_active: { type: "boolean" },
      company_id: { type: "integer" }
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

module.exports = postOfferTypeSchema;
