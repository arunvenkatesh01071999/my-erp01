const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferMasterInfoSchema = {
  tags: ["Offer Master"],
  summary: "This API is to get Offer Master Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        prod_code: { type: "string", description: "Product code" },
        product_name: { type: "string", description: "Product Name" },
        amount: { type: "number", format: "float", description: "Amount for price offer" },
        etype: { type: "integer", description: "Event type or offer type" },
        pfrom: { type: "string", format: "date-time", description: "Price offer start date" },
        pto: { type: "string", format: "date-time", description: "Price offer end date" },
        pname: { type: "string", maxLength: 500, description: "Product name" },
        pcompamt: { type: "number", format: "float", description: "Price component amount" },
        plocamt: { type: "number", format: "float", description: "Price local amount" },
        pactive: { type: "integer", enum: [0, 1], description: "Active status (0 or 1)" },
        oid: { type: "integer", description: "Outlet ID" },
        downdt: { type: ["string", "null"], format: "date-time", description: "Download date" },
        status: { type: "integer", enum: [0, 1], description: "Status of the price offer" },
        uid: { type: "integer", description: "User ID who created or updated the price offer" },
        pmrp: { type: "number", format: "float", minimum: 0, description: "Product MRP" },
        company_id: { type: "integer", default: 1, description: "Company ID" },
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
    },
    ...errorSchemas
  }
};

module.exports = getOfferMasterInfoSchema;
