const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOfferMasterInfoSchema = {
  tags: ["Offer Master"],
  summary: "This API is to get Offer Master Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      sid: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        sid: { type: "integer" },
        sname: { type: "string", maxLength: 200, description: "Scheme name" },
        fdate: { type: "string", format: "date-time", description: "From date" },
        tdate: { type: "string", format: "date-time", description: "To date" },
        pamount: { type: "number", minimum: 0, description: "Purchase amount" },
        dtype: { type: "integer", description: "Discount type" },
        dval: { type: "number", minimum: 0, description: "Discount value" },
        active: { type: "boolean", description: "Is the scheme active?" },
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
    },
    ...errorSchemas
  }
};

module.exports = getOfferMasterInfoSchema;
