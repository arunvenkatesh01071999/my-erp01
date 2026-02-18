const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferTypeInfoSchema = {
  tags: ["Offer Type"],
  summary: "This API is to get Offer Type",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      oid: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        oid: { type: "integer" },
        oname: { type: "string" },
        is_active: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOfferTypeInfoSchema;
