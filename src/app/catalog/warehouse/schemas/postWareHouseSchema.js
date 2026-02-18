const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postWarehouseSchema = {
  tags: ["WAREHOUSE"],
  summary: "This API is to post WAREHOUSE",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "warehouse_name",
      "short_name",
      "add1",
      "add2",
      "pincode",
      "country",
      "state",
      "city",
      "main_warehouse",
      "contact_name",
      "mobile",
      "email",
      "limitation",
      "gstin",
      "fssai",
      "wallet_balance",
      "is_gst",
      "bankacno",
      "bankname",
      "acname",
      "ifsccode",
      "company_id",
      "is_active"
    ],
    properties: {
      warehouse_name: {
        type: "string",
        // pattern: "^[A-Za-z0-9 &()-]+$",
        // errorMessage: "Invalid warehouse_name. Only letters, numbers, spaces, and &()- are allowed."
      },
      short_name: {
        type: "string",
        // pattern: "^[A-Za-z0-9 ]+$",
        // errorMessage: "Invalid short_name. Only letters, numbers, and spaces are allowed."
      },
      contact_name: {
        type: "string",
        // pattern: "^[A-Za-z ]+$",
        // errorMessage: "Invalid contact_name. Only letters and spaces are allowed."
      },
      add1: { type: "string" },
      add2: { type: "string" },
      add3: { type: "string" },
      add4: { type: "string" },
      city: { type: "integer", minimum: 1 },
      pincode: {
        type: "string",
        // pattern: "^[0-9]{6}$",
        // errorMessage: "Invalid pincode. It should be a 6-digit number."
      },
      state: { type: "integer", minimum: 1 },
      country: { type: "integer", minimum: 1 },
      phone: {
        type: "string",
        // pattern: "^[6-9][0-9]{9}$",
        // errorMessage: "Invalid phone number. It should be a 10-digit number starting with 6-9."
      },
      mobile: {
        type: "string",
        // pattern: "^[6-9][0-9]{9}$",
        // errorMessage: "Invalid mobile number. It should be a 10-digit number starting with 6-9."
      },
      email: {
        type: "string"
      },
      company_id: { type: "integer", minimum: 1 },
      is_active: { type: "boolean" },
      limitation: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Invalid limitation. It should be a numeric value."
      },
      gstin: {
        type: "string",
        // pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$",
        // errorMessage: "Invalid GSTIN format."
      },
      fssai: {
        type: "string",
        // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        // errorMessage: "Invalid PAN number. Must be 10 characters long (Format: ABCDE1234F)."
      },
      bankacno: {
        type: "string",
        // pattern: "^[0-9]{9,18}$",
        // errorMessage: "Invalid bank account number. It should be 9-18 digits long."
      },
      bankname: {
        type: "string",
        // pattern: "^[A-Za-z &]+$",
        // minLength: 3,
        // maxLength: 100,
        // errorMessage: "Invalid bank name. Only letters, spaces, and & are allowed."
      },
      acname: {
        type: "string",
        // pattern: "^[A-Za-z ]+$",
        // minLength: 3,
        // maxLength: 100,
        // errorMessage: "Invalid account holder name. Only letters and spaces are allowed."
      },
      ifsccode: {
        type: "string",
        // pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
        // errorMessage: "Invalid IFSC code format."
      },
      is_gst: { type: "boolean" },
      main_warehouse: { type: "boolean" },
      wallet_balance: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Invalid wallet_balance. It should be a numeric value."
      },
      company_details: {
        type: "array",
        items: {
          type: "object",
          properties: {
            company_id: { type: "integer" }
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

module.exports = postWarehouseSchema;
