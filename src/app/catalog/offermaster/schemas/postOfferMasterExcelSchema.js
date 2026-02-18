const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOfferMasterExcelSchema = {
  tags: ["Offer"],
  summary: "Upload Excel and create multiple offers",
  consumes: ["multipart/form-data"],
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["outlet_ids", "omode", "Otype"],
    properties: {
      outlet_ids: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            type: "string",
            description: "Comma separated outlet IDs (e.g. 1,2,3)"
          }
        }
      },

      omode: {
        type: "object",
        required: ["value"],
        properties: {
          value: { type: "integer", minimum: 1 }
        }
      },

      Otype: {
        type: "object",
        required: ["value"],
        properties: {
          value: { type: "integer", minimum: 1 }
        }
      },

      // Optional partner mapping (future use)
      ppartner: {
        type: "object",
        properties: {
          value: {
            type: "string",
            description: "Comma separated partner IDs"
          }
        }
      },

      // Excel file
      file: {
        type: "object",
        description: "Excel file (.xlsx / .xls)"
      }
    }
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
              index: {
                type: "integer",
                description: "Excel row index (0-based)"
              },
              reason: {
                type: "string",
                description: "Failure reason"
              },
              offer: {
                type: "object",
                description: "Parsed offer payload that failed"
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = postOfferMasterExcelSchema;
