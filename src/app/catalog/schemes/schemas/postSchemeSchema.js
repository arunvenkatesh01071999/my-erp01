const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSchemeSchema = {
  tags: ["Schemes"],
  summary: "This API is to create a new Scheme",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "sname",
      "fdate",
      "tdate",
      "pamount",
      "dtype",
      "dval",
      "active",
      "pid",
      "smode",
      "outlet_ids",
      "stype",
      "company_id"
    ],
    properties: {
      sname: { type: "string", maxLength: 200, description: "Scheme name" },
      fdate: { type: "string", format: "date-time", description: "From date" },
      tdate: { type: "string", format: "date-time", description: "To date" },
      pamount: { type: "number", minimum: 0, description: "Purchase amount" },
      dtype: { type: "integer", description: "Discount type" },
      dval: { type: "number", minimum: 0, description: "Discount value" },
      active: { type: "integer", description: "Is the scheme active?" },
      // pid: {
      //   type: "string",
      //   maxLength: 8000,
      //   nullable: true,
      //   description: "Product IDs associated with the scheme"
      // },
      pid: {
        type: "array",
        items: { type: "integer" },
        // minItems: 1,
        description: "Array of outlet IDs, must contain at least one ID"
      },
      smode: { type: "integer", description: "Scheme mode" },
      outlet_ids: {
        type: "array",
        items: { type: "integer" },
        minItems: 1,
        description: "Array of outlet IDs, must contain at least one ID"
      },
      stype: { type: "integer", default: 0, description: "Scheme type" },
      cat_ids: {
        type: "array",
        items: { type: "integer" },
        // minItems: 1,
        description: "Array of Cat IDs, must contain at least one ID"
      },
      qty: { type: "number", default: 1, description: "Qty" },
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

module.exports = postSchemeSchema;
