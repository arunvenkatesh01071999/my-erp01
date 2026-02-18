const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierByOutletSchema = {
  tags: ["SUPPLIER BY OUTLETS"],
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
          approval: { type: "boolean" },
          city: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" }
            }
          },
          state: {
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
          },
          pincode: { type: "string" },
          phone: { type: "string" },
          mobile: { type: "string" },
          email: { type: "string" },
          website: { type: "string" },
          gstin: { type: "string" },
          op_bal: { type: "string" },
          balance: { type: "string" },
          gst_type: { type: "string" },
          bankacno: { type: "string" },
          bankname: { type: "string" },
          acname: { type: "string" },
          ifsccode: { type: "string" },
          company_id: { type: "integer" },
          available_balance: { type: "number" },
          is_active: { type: "boolean" },
          fssai: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSupplierByOutletSchema;
