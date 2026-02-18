const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const mbqPoSettingsSchema = {
  tags: ["MBQ PoSettings"],
  summary: "This API is to handle MBQ PoSettings",
  headers: { $ref: "request-headers#" },
  body: {
    type: "array",
    minItems: 1,
    items: {
      type: "object",
      required: [
        "LocName",
        "Code",
        "SaleDays",
        "Times",
        "MinMbq",
        "Flag",
        "U_ID",
        "Ctype",
        "VLT"
      ],
      properties: {
        LocName: { type: "string" },
        Code: { type: "string" },
        SaleDays: { type: "integer" },
        Times: { type: "integer" },
        MinMbq: { type: "integer" },
        Flag: { type: "integer" },
        U_ID: { type: "integer" },
        Ctype: { type: "integer" },
        VLT: { type: "integer" }
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        inserted: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Locid: { type: "integer" },
              Code: { type: "string" }
            },
            required: ["Locid", "Code"]
          }
        },
        failed: {
          type: "array",
          items: {
            type: "object",
            properties: {
              Locid: { type: "integer" },
              Code: { type: "string" },
              LocName: { type: "string" },
              reason: { type: "string" }
            },
            required: ["Locid", "Code", "LocName", "reason"]
          }
        },
        duplicatesRemoved: { type: "integer" }
      },
    },
    ...errorSchemas
  }
};

module.exports = mbqPoSettingsSchema;
