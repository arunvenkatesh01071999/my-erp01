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
      etype: { type: "integer", enum: [0, 1, 2] },
      prod_code: { type: "string" }
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
              id: { type: "integer" },
              prod_code: { type: "string", description: "Product code" },
              product_name: { type: "string", description: "Product Name" },
              amount: { type: "number", format: "float", description: "Amount for price offer" },
              etype: { type: "integer", description: "Event type or offer type" },
              type: { type: "string", description: "Offer type" },
              pfrom: { type: "string", format: "date-time", description: "Price offer start date" },
              pto: { type: "string", format: "date-time", description: "Price offer end date" },
              pname: { type: "string", maxLength: 500, description: "Product name" },
              pcompamt: { type: "number", format: "float", description: "Price component amount" },
              plocamt: { type: "number", format: "float", description: "Price local amount" },
              pactive: { type: "integer", enum: [0, 1], description: "Active status (0 or 1)" },
              oid: { type: "integer", description: "Outlet ID" },
              pid: { type: "integer", description: "Price offer ID" },
              downdt: { type: ["string", "null"], format: "date-time", description: "Download date" },
              status: { type: "integer", enum: [0, 1], description: "Status of the price offer" },
              uid: { type: "integer", description: "User ID who created or updated the price offer" },
              pmrp: { type: "number", format: "float", minimum: 0, description: "Product MRP" },
              company_id: { type: "integer", default: 1, description: "Company ID" },
              // outlets_lines: {
              //   type: "array",
              //   items: {
              //     type: "object",
              //     properties: {
              //       id: { type: "integer" },
              //       // short_name: { type: "string" },
              //       // fullname: { type: "string" },
              //       // code: { type: "string" },
              //     }
              //   }
              // },
              outlets_lines: {
                type: "array",
                items: {
                  type: "integer"
                }
              },
              partner_lines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    ppartner_id: { type: "integer" },
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
