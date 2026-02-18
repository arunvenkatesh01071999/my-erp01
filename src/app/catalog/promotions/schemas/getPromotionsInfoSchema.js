const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPromotionsInfoSchema = {
  tags: ["Offer Master"],
  summary: "This API is to get Offer Master Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      pid: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        pid: { type: "integer" },
        pname: { type: "string", maxLength: 200, description: "Scheme name" },
        pamount: { type: "number", minimum: 0, description: "Purchase amount" },
        fdate: { type: "string", format: "date-time", description: "From date" },
        tdate: { type: "string", format: "date-time", description: "To date" },
        active: { type: "number" },
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
        },
        outlets_lines: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              short_name: { type: "string" },
              fullname: { type: "string" },
              code: { type: "string" },
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPromotionsInfoSchema;
