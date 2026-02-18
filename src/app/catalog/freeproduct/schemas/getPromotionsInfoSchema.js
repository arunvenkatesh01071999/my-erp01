const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPromotionsInfoSchema = {
  tags: ["Free Product"],
  summary: "This API is to get Free Product Info",
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
        sid: { type: "integer" },
        fname: { type: "string", maxLength: 200, description: "Scheme name" },
        ffrom: { type: "string", format: "date-time", description: "From date" },
        fto: { type: "string", format: "date-time", description: "To date" },
        active: {
          type: "number",
          description: "Active status (1 for active, 0 for inactive)"
        },
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
