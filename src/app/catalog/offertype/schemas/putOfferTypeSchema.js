const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOfferTypeSchema = {
  tags: ["OfferType"],
  summary: "This API is to update OfferType",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      oid: { type: "integer" }
    }
  },
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

module.exports = putOfferTypeSchema;
