const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postPriceOffExcelSchema = {
  tags: ["PriceOff"],
  summary: "API to import Price Off entries using Excel",
  headers: { $ref: "request-headers#" },
  consumes: ["multipart/form-data"],

  body: {
    type: "object",
    required: ["excelfile", "outlet", "pname"],
    properties: {
      excelfile: {
        type: "object",
        description: "Excel file (.xlsx)",
      },

      outlet: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            type: "string",
            description: "Comma separated outlet ids (eg: 227,228)",
            minLength: 1,
          },
        },
      },

      pname: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            type: "string",
            maxLength: 500,
            description: "Product name",
          },
        },
      },

      etype: {
        type: "object",
        properties: {
          value: {
            type: "integer",
            default: 1,
            description: "Event type or offer type",
          },
        },
      },

      pactive: {
        type: "object",
        properties: {
          value: {
            type: "integer",
            enum: [0, 1],
            default: 1,
            description: "Active status",
          },
        },
      },

      status: {
        type: "object",
        properties: {
          value: {
            type: "integer",
            enum: [0, 1],
            default: 1,
            description: "Status",
          },
        },
      },

      downdt: {
        type: "object",
        properties: {
          value: {
            type: "string",
            format: "date-time",
            description: "Download date",
          },
        },
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        failedInserts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              index: { type: "integer" },
              reason: { type: "string" },
              payload: { type: "object" },
            },
          },
        },
      },
    },

    ...errorSchemas,
  },
};

module.exports = postPriceOffExcelSchema;
