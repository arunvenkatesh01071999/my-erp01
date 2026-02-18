const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putOfferMasterSchema = {
  tags: ["Offer"],
  summary: "This API is to update an Offer",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["oid"], // Offer ID is mandatory
    properties: {
      oid: { type: "integer", description: "Unique Offer ID" }
    }
  },
  body: {
    type: "object",
    required: [
      "Otype",
      "Oname",
      "obuy",
      "oget",
      "Pfrom",
      "Pto",
      "Active",
      "uid",
      "dis",
      "poff",
      "omode",
      "PCompAmt",
      "PLocAmt"
    ],
    properties: {
      Otype: { type: "integer" },
      Oname: { type: "string", maxLength: 600 },
      obuy: { type: "integer" },
      oget: { type: "integer" },
      Pfrom: { type: "string", format: "date-time" },
      Pto: { type: "string", format: "date-time" },
      Active: { type: "boolean" },
      Obuyid: { type: ["integer", "null"] },
      Ogetid: { type: ["integer", "null"] },
      uid: { type: "integer" },
      dis: { type: "number", minimum: 0 },
      poff: { type: "number" },
      omode: { type: "integer" },
      outlet_ids: {
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
      PCompAmt: { type: "number", minimum: 0 },
      PLocAmt: { type: "number", minimum: 0 },
      company_id: { type: "integer", description: "Company ID", default: 1 }
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

module.exports = putOfferMasterSchema;
