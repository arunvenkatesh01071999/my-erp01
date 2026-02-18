const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletSchema = {
  tags: ["CREATE OUTLETS"],
  summary: "This API is to create outlets",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "code",
      "short_name",
      "fullname",
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
      "limitation",
      "wallet_balance",
      "is_gst",
      "outlet_type",
      "bankacno",
      "bankname",
      "acname",
      "ifsccode",
      "warehouse_id"
    ],
    properties: {
      code: {
        type: "string",
        // pattern: "^[A-Z0-9-]+$",
        // errorMessage: "Code must be uppercase letters, numbers, or hyphens only"
      },
      short_name: {
        type: "string",
        //  minLength: 2, 
        //  errorMessage: "Short name is required"
      },
      fullname: {
        type: "string",
        //  minLength: 3, 
        //  errorMessage: "Full name is required" 
      },
      add1: {
        type: "string",
        //  errorMessage: "Address line 1 is required" 
      },
      add2: { type: "string" },
      add3: { type: "string" },
      add4: { type: "string" },
      city: {
        type: "integer",
        // errorMessage: "City must be a valid integer" 
      },
      pincode: {
        type: "string",
        // pattern: "^[0-9]{6}$",
        // errorMessage: "Pincode must be a 6-digit number"
      },
      state: {
        type: "integer",
        // errorMessage: "State must be a valid integer" 
      },
      country: {
        type: "integer",
        //  errorMessage: "Country must be a valid integer" 
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
        // pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$",
        // errorMessage: "Invalid GSTIN format"
      },
      fssai: {
        type: "string",
        // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        // errorMessage: "Invalid PAN number. Must be 10 characters long (Format: ABCDE1234F)."
      },
      outlet_type: {
        type: "integer",
        //  errorMessage: "Outlet type must be an integer" 
      },
      franchise_type: { type: "string" },
      bankacno: {
        type: "string",
        // pattern: "^[0-9]{9,18}$",
        // errorMessage: "Bank account number must be 9-18 digits long"
      },
      bankname: {
        type: "string",
        // pattern: "^[A-Za-z ]+$",
        // errorMessage: "Bank name must contain only letters and spaces"
      },
      acname: {
        type: "string",
        // errorMessage: "Account name is required" 
      },
      ifsccode: {
        type: "string",
        // pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
        // errorMessage: "Invalid IFSC code format"
      },
      is_gst: {
        type: "boolean",
        // errorMessage: "is_gst must be true or false" 
      },
      credit_limit: {
        type: "number",
        // minimum: 0 
      },
      limitation: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Limitation must be a number with up to 2 decimal places"
      },
      wallet_balance: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Wallet balance must be a number with up to 2 decimal places"
      },
      for_indent: {
        type: "integer",
        enum: [1, 2],
        errorMessage: "for_indent must be 1 or 2"
      },
      warehouse_id: {
        type: "integer",
        errorMessage: "Warehouse id must be an integer"
      }
    },
    errorMessage: {
      required: {
        code: "Code is required",
        short_name: "Short name is required",
        fullname: "Full name is required",
        add1: "Address line 1 is required",
        city: "City is required",
        pincode: "Pincode is required",
        state: "State is required",
        country: "Country is required",
        email: "Email is required",
        website: "Website is required",
        gstin: "GSTIN is required",
        fssai: "FSSAI is required",
        outlet_type: "Outlet type is required",
        bankacno: "Bank account number is required",
        bankname: "Bank name is required",
        acname: "Account name is required",
        ifsccode: "IFSC code is required",
        is_gst: "is_gst is required",
        limitation: "Limitation is required",
        wallet_balance: "Wallet balance is required",
        warehouse_id: "Warehouse id is required"
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

module.exports = postOutletSchema;
