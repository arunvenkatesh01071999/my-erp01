const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postVendorEmailSchema = {
  tags: ["VENDOR EMAIL"],
  summary: "This API is to post vendor email details",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: [
      "region_id",
      "outlet_id",
      "outlet_email",
      "brand_company_id",
      "brand_company_email",
      "supplier_id",
      "supplier_email"
    ],
    properties: {

      region_id: {
        type: "integer",
        errorMessage: "region_id must be an integer"
      },

      outlet_id: {
        type: "array",
        items: { type: "integer" },
        errorMessage: "outlet_id must be an array of integers"
      },

      brand_company_id: {
        type: "integer",
        errorMessage: "brand_company_id must be an integer"
      },

      supplier_id: {
        type: "integer",
        errorMessage: "supplier_id must be an integer"
      },

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
      }

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

module.exports = postVendorEmailSchema;
