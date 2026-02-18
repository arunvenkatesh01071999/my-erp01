const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOfferMasterSchema = {
  tags: ["Offer"],
  summary: "This API is to post an Offer",
  headers: { $ref: "request-headers#" },
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
      // "outlet_ids",
      // "ppartner",
      "PCompAmt",
      "PLocAmt"
    ],
    properties: {
      Otype: { type: "integer" },
      Oname: { type: "string", maxLength: 60 },
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
      PLocAmt: { type: "number", minimum: 0 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      }
    },
    ...errorSchemas
  }
};

module.exports = postOfferMasterSchema;
