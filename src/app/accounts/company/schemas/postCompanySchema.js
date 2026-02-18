const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postCompanySchema = {
  tags: ["CREATE COMPANY"],
  summary: "This API is to create company",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "code",
      "company_fullname",
      "company_short_name",
      "add1",
      "add2",
      "pincode",
      "country",
      "state",
      "city",
      "mobile",
      "email",
      "website",
      "gstin",
      "fssai",
      "bank_details"
    ],
    properties: {
      code: { type: "string" },
      company_short_name: {
        type: "string"
      },
      company_fullname: {
        type: "string"
      },
      add1: { type: "string" },
      add2: { type: "string" },
      add3: { type: "string" },
      add4: { type: "string" },
      city: {
        type: "integer",
        errorMessage: "City must be a valid numeric ID."
      },
      pincode: {
        type: "string",
        // pattern: "^[0-9]{5,10}$",
        // errorMessage: "Invalid pincode. Must be between 5 to 10 digits."
      },
      state: {
        type: "integer",
        errorMessage: "State must be a valid numeric ID."
      },
      country: {
        type: "integer",
        errorMessage: "Country must be a valid numeric ID."
      },
      phone: {
        type: "string",
        // pattern: "^[6-9][0-9]{9}$",
        // errorMessage: "Invalid phone. Must be a 10-digit number."
      },
      mobile: {
        type: "string",
        // pattern: "^[6-9][0-9]{9}$",
        // errorMessage: "Invalid mobile. Must be a 10-digit number."
      },
      email: {
        type: "string"
      },
      website: {
        type: "string"
      },
      gstin: {
        type: "string",
        // pattern: "^[0-9A-Z]{15}$",
        // errorMessage: "Invalid GSTIN. Must be exactly 15 alphanumeric characters."
      },
      fssai: {
        type: "string",
        // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        // errorMessage: "Invalid PAN number. Must be 10 characters long (Format: ABCDE1234F)."
      },
      is_active: { type: "boolean" },
      bank_details: {
        type: "array",
        items: {
          type: "object",
          required: ["bankacno", "bankname", "acname", "ifsccode"],
          properties: {
            bankacno: {
              type: "string",
              // pattern: "^[0-9]{9,18}$",
              // errorMessage: "Invalid bank account number. Must be 9 to 18 digits."
            },
            bankname: {
              type: "string",
              // pattern: "^[A-Za-z ]+$",
              // errorMessage: "Invalid bank name. Only letters and spaces are allowed."
            },
            acname: {
              type: "string",
              // pattern: "^[A-Za-z ]+$",
              // errorMessage: "Invalid account name. Only letters and spaces are allowed."
            },
            ifsccode: {
              type: "string",
              // pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
              // errorMessage: "Invalid IFSC code. Must follow standard bank IFSC format."
            }
          }
        }
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

module.exports = postCompanySchema;
