const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPromotionsSchema = {
  tags: ["Free Product"],
  summary: "This API is to update  Free Product",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["sid"], // Offer ID is mandatory
    properties: {
      sid: { type: "integer", description: "Unique Offer ID" }
    }
  },
  body: {
    type: "object",
    required: [
      "fname",
      "ffrom",
      "fto",
      "active",
      "outlet_ids",
      "company_id"
    ],
    properties: {
      fname: { type: "string", maxLength: 200, description: "Scheme name" },
      ffrom: { type: "string", format: "date-time", description: "From date" },
      fto: { type: "string", format: "date-time", description: "To date" },
      active: { type: "number", description: "Is the scheme active?" },
      outlet_ids: {
        type: "array",
        items: { type: "integer" },
        minItems: 1,
        description: "Array of outlet IDs, must contain at least one ID"
      },
      company_id: {
        type: "integer",
        default: 1,
        description: "Company ID, default is 1"
      }
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

module.exports = putPromotionsSchema;
