const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferTypePaginateSchema = {
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
              oid: { type: "integer" },
              oname: { type: "string" },
              otype: { type: "integer" },
              obuy: { type: "integer" },
              oget: { type: "integer" },
              pfrom: { type: "string", format: "date-time" },
              pto: { type: "string", format: "date-time" },
              active: { type: "boolean" },
              uid: { type: "integer" },
              dis: { type: "number" },
              poff: { type: "number" },
              omode: { type: "integer" },
              pcompamt: { type: "number" },
              plocamt: { type: "number" },
              company_id: { type: "integer" },
              obuyid: { type: ["integer"] },
              ogetid: { type: ["integer"] },
              buy_product_name: { type: "string" },
              get_product_name: { type: "string" },
              get_pro_code: { type: "string" },
              buy_pro_code: { type: "string" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
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

module.exports = getOfferTypePaginateSchema;
