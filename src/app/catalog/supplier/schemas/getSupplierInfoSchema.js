const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierInfoSchema = {
  tags: ["SUPPLIER INFO"],
  summary: "This API is to get SUPPLIER Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      supplier_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        supplier_name: { type: "string" },
        supplier_code: { type: "string" },
        short_name: { type: "string" },
        add1: { type: "string" },
        add2: { type: "string" },
        add3: { type: "string" },
        add4: { type: "string" },
        city: { type: "integer" },
        city_name: { type: "string" },
        pincode: { type: "string" },
        state: { type: "integer" },
        state_name: { type: "string" },
        country: { type: "integer" },
        country_name: { type: "string" },
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
        is_dsd: {
          type: "integer"
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSupplierInfoSchema;
