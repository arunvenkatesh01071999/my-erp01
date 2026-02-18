const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSupplierSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to post supplier",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "supplier_name",
      "short_name",
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
      "op_bal",
      "custtype",
      "company_id",
      "is_active",
      "bankacno",
      "bankname",
      "acname",
      "ifsccode"
    ],
    properties: {
      supplier_name: {
        type: "string",
        // pattern: "^[A-Za-z0-9 ]+$",
        // errorMessage: "Invalid supplier_name. Only letters, numbers, and spaces are allowed."
      },
      short_name: {
        // type: "string",
        // pattern: "^[A-Za-z0-9]+$",
        // errorMessage: "Invalid short_name. Only letters and numbers are allowed."
      },
      add1: { type: "string" },
      add2: { type: "string" },
      add3: { type: "string" },
      add4: { type: "string" },
      company_id: { type: "integer" },
      country: { type: "integer" },
      state: { type: "integer" },
      city: { type: "integer" },
      pincode: {
        type: "string",
        // pattern: "^[0-9]{6}$",
        // errorMessage: "Invalid pincode. Must be a 6-digit number."
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
        // pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$",
        // errorMessage: "Invalid GSTIN format."
      },
      custtype: { type: "integer" },
      bankacno: {
        type: "string",
        // pattern: "^[0-9]{9,18}$",
        // errorMessage: "Invalid bank_ac_no. Must be between 9 and 18 digits."
      },
      bankname: { type: "string" },
      acname: { type: "string" },
      ifsccode: {
        type: "string",
        // pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
        // errorMessage: "Invalid IFSC code format."
      },
      is_active: { type: "boolean" },
      fssai: {
        type: "string",
        // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        // errorMessage: "Invalid PAN number. Must be 10 characters long (Format: ABCDE1234F)."
      },
      op_bal: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Invalid opening balance. Must be a valid decimal number."
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

module.exports = postSupplierSchema;
