const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putPriceOffSchema = {
  tags: ["Price Offer"],
  summary: "This API is to update an Price Offer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["pid"], // Offer ID is mandatory
    properties: {
      pid: { type: "integer", description: "Unique Offer ID" }
    }
  },
  body: {
    type: "object",
    required: [
      "prod_code",
      "amount",
      "etype",
      "pfrom",
      "pto",
      "outlet",
      "pname",
      // "ppartner",
      "pcompamt",
      "plocamt",
      "pactive",
      // "oid",
      // "status",
      "uid",
      "pmrp"
    ],
    properties: {
      prod_code: { type: "string", description: "Product code" },
      amount: { type: "number", format: "float", description: "Amount for price offer" },
      etype: { type: "integer", description: "Event type or offer type" },
      pfrom: { type: "string", format: "date-time", description: "Price offer start date" },
      pto: { type: "string", format: "date-time", description: "Price offer end date" },
      pname: { type: "string", maxLength: 500, description: "Product name" },
      pcompamt: { type: "number", format: "float", description: "Price component amount" },
      plocamt: { type: "number", format: "float", description: "Price local amount" },
      pactive: { type: "number", enum: [0, 1], description: "Active status (0 or 1)" },
      // oid: { type: "integer", description: "Outlet ID" },
      downdt: { type: ["string", "null"], format: "date-time", description: "Download date" },
      // status: { type: "integer", enum: [0, 1], description: "Status of the price offer" },
      uid: { type: "integer", description: "User ID who created or updated the price offer" },
      pmrp: { type: "number", format: "float", minimum: 0, description: "Product MRP" },
      company_id: { type: "integer", default: 1, description: "Company ID" },
      outlet: {
        type: "array",
        items: { type: "integer" },
        minItems: 1,
        description: "Array of outlet IDs, must contain at least one ID",
      },
      ppartner: {
        type: "array",
        items: { type: "integer" },
        minItems: 1,
        description: "Array of partner IDs, must contain at least one ID",
      },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = putPriceOffSchema;
