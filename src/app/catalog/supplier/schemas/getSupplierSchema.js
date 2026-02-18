const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to get SUPPLIER",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          supplier_name: { type: "string" },
          short_name: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          add4: { type: "string" },
          pincode: { type: "string" },
          phone: { type: "string" },
          mobile: { type: "string" },
          email: { type: "string" },
          website: { type: "string" },
          gstin: { type: "string" },
          op_bal: { type: "string" },
          balance: { type: "string" },
          custtype: { type: "string" },
          bank_ac_no: { type: "string" },
          bankname: { type: "string" },
          ac_name: { type: "string" },
          ifsccode: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
          fssaino: { type: "string" },
          supplier_code: { type: "string" },
          msme_applicable: { type: "boolean" },
          msme_number: { type: "string" },
          msme_declaration: { type: "string" },
          credit_days: { type: "string" },
          tot_margin_percentage: { type: "number" },
          tot_margin_value: { type: "number" },
          contact_person: { type: "string" },
          designation: { type: "string" },
          alter_mobile_no: { type: "string" },
          purchase: { type: "boolean" },
          transfer: { type: "boolean" },
          product_type: { type: "string" },
          payment_terms: { type: "string" },
          is_dsd: {
            type: "integer"
          },
          // nested objects
          state: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          city: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          country: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSupplierSchema;
