const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putVendorEmailSchema = {
  tags: ["VENDOR EMAIL"],
  summary: "This API is to update an vendor emails details",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: [
      "id"
    ],
    properties: {
      id: {
        type: "integer",
        errorMessage: "Id must be an integer"
      }
    },
  },
  body: {
    type: "object",
    properties: {
      outlet_email: {
        type: "array",
        items: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              errorMessage: {
                type: "outlet_email.email must be a string",
                format: "outlet_email.email must be a valid email"
              }
            }
          }
        },
        errorMessage: "outlet_email must be an array of { email: string }"
      },

      brand_company_email: {
        type: "array",
        items: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              errorMessage: {
                type: "brand_company_email.email must be a string",
                format: "brand_company_email.email must be a valid email"
              }
            }
          }
        },
        errorMessage: "brand_company_email must be an array of { email: string }"
      },

      supplier_email: {
        type: "array",
        items: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              errorMessage: {
                type: "supplier_email.email must be a string",
                format: "supplier_email.email must be a valid email"
              }
            }
          }
        },
        errorMessage: "supplier_email must be an array of { email: string }"
      },
      is_active: {
        type: "boolean",
        errorMessage: "Status must be a boolean"
      },
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

module.exports = putVendorEmailSchema;
