const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSupplierSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to update SUPPLIER",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "supplier_name",
      "short_name",
      "supplier_code",
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
      supplier_code: {
        type: "string",
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
      gst_type: { type: "string" },
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
      pan: {
        type: "string",
      },
      fssai: {
        type: "string",
        // pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        // errorMessage: "Invalid PAN number. Must be 10 characters long (Format: ABCDE1234F)."
      },
      op_bal: {
        type: "string",
        // pattern: "^[0-9]+(\\.[0-9]{1,2})?$",
        // errorMessage: "Invalid opening balance. Must be a valid decimal number."
      },
      msme_applicable: { type: "boolean" },
      msme_number: { type: "string" },
      msme_declaration: { type: "string" },
      credit_days: { type: "integer" },
      tot_margin_percentage: { type: "number" },
      tot_margin_value: { type: "number" },
      contact_person: { type: "string" },
      designation: { type: "string" },
      alter_mobile_no: { type: "string" },
      purchase: { type: "boolean" },
      transfer: { type: "boolean" },
      product_type: { type: "string" },
      payment_terms: { type: "string" },
      pan_status: {
        type: "integer",
        enum: [0, 1],
        description: "PAN status — 0 or 1 only"
      },
      gst_status: {
        type: "integer",
        enum: [0, 1, 2, 3],
        description: "GST status — allowed values are 0, 1, 2, 3"
      },
      is_dsd: {
        type: "integer",
        enum: [0, 1, 2],
        description: "Dsd — allowed values are 0, 1, 2"
      },
      fssai_expiry: {
        type: "string",
        format: "date",
        errorMessage: "fssai_expiry must be a valid date in YYYY-MM-DD format"
      },
      order_days: {
        type: "object",
        properties: {
          sunday: { type: "boolean" },
          monday: { type: "boolean" },
          tuesday: { type: "boolean" },
          wednesday: { type: "boolean" },
          thursday: { type: "boolean" },
          friday: { type: "boolean" },
          saturday: { type: "boolean" }
        },
        additionalProperties: false
      },
      month_days: { type: "string" },
      despatch_days: {
        type: "object",
        properties: {
          sunday: { type: "boolean" },
          monday: { type: "boolean" },
          tuesday: { type: "boolean" },
          wednesday: { type: "boolean" },
          thursday: { type: "boolean" },
          friday: { type: "boolean" },
          saturday: { type: "boolean" }
        },
        additionalProperties: false
      },
      outlets: {
        type: "array",
        items: {
          type: "object",
          required: ["outlet_id"],
          properties: {
            outlet_id: { type: "integer" }
          }
        }
      },
      warehouse: {
        type: "array",
        items: {
          type: "object",
          required: ["warehouse_id"],
          properties: {
            warehouse_id: { type: "integer" }
          }
        }
      },
      documents: {
        type: "array",
        items: {
          type: "object",
          required: ["document_name", "path_url"],
          properties: {
            document_name: { type: "string" },
            path_url: { type: "string" }
          }
        }
      },
      cheque: {
        type: "array",
        items: {
          type: "object",
          required: ["document_name", "path_url"],
          properties: {
            document_name: { type: "string" },
            path_url: { type: "string" }
          }
        }
      }
    },
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

module.exports = putSupplierSchema;
