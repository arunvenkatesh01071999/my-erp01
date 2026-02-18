const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSchemePaginateSchema = {
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
              sid: { type: "integer" },
              sname: { type: "string", maxLength: 200, description: "Scheme name" },
              fdate: { type: "string", format: "date-time", description: "From date" },
              tdate: { type: "string", format: "date-time", description: "To date" },
              pamount: { type: "number", minimum: 0, description: "Purchase amount" },
              dtype: { type: "integer", description: "Discount type" },
              dval: { type: "number", minimum: 0, description: "Discount value" },
              active: { type: "number" },
              product_name: { type: "string", description: "Product name" },
              pro_code: { type: "string", description: "Product Code" },
              // pid: {
              //   type: "string",
              //   maxLength: 8000,
              //   nullable: true,
              //   description: "Product IDs associated with the scheme"
              // },
              pid: {
                type: "array",
                items: { type: "integer" },
                minItems: 1,
                description: "Array of outlet IDs, must contain at least one ID"
              },
              smode: { type: "integer", description: "Scheme mode" },
              outlet_ids: {
                type: "array",
                items: { type: "integer" },
                minItems: 1,
                description: "Array of outlet IDs, must contain at least one ID"
              },
              cat_ids: {
                type: "array",
                items: { type: "integer" },
                minItems: 1,
                description: "Array of Cat IDs, must contain at least one ID"
              },
              qty: { type: "number", default: 1, description: "Qty" },
              stype: { type: "integer", default: 0, description: "Scheme type" },
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

module.exports = getSchemePaginateSchema;
