const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPromotionsSchema = {
  tags: ["Schemes"],
  summary: "This API is to create a new Scheme",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "pname",
      "pamount",
      "fdate",
      "tdate",
      "active",
      "outlet_ids",
      "company_id"
    ],
    properties: {
      pname: { type: "string", maxLength: 200, description: "Scheme name" },
      pamount: { type: "number", minimum: 0, description: "Purchase amount" },
      fdate: { type: "string", format: "date-time", description: "From date" },
      tdate: { type: "string", format: "date-time", description: "To date" },
      active: { type: "integer", description: "Is the scheme active?" },
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
        success: { type: "boolean" },
        message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postPromotionsSchema;
