const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferTypeSchema = {
  tags: ["Offer Type"],
  summary: "This API is to get OfferType",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          oid: { type: "integer" },
          oname: { type: "string" },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOfferTypeSchema;
