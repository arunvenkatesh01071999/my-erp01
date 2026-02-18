const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPromotionsPaginateSchema = {
  tags: ["Offer Type"],
  summary: "This API is to get OfferType",
  headers: { $ref: "request-headers#" },

  queryString: {
    type: "object",
    required: ["status", "search"],
    additionalProperties: false,
    properties: {
      status: { type: "integer", enum: [0, 1, 2], default: 0 },
      search: { type: "string", default: "" },
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" },
    },
  },

  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
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
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPromotionsPaginateSchema;
