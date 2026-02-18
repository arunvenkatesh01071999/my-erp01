const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletInfoSchema = {
  tags: ["OUTLETs INFO"],
  summary: "This API is to get outlet information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      outlet_id: { type: "integer" },
      company_id: { type: "integer" },
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        code: { type: "string" },
        short_name: { type: "string" },
        fullname: { type: "string" },
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
        phone: { type: "string", pattern: "^[0-9]{10,12}$" },
        mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
        email: { type: "string", format: "email" },
        website: {
          type: "string",
          pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
        },
        gstin: { type: "string" },
        fssai: { type: "string" },
        outlet_type: { type: "integer" },
        outlet_type_name: { type: "string" },
        bankacno: { type: "string" },
        bankname: { type: "string" },
        acname: { type: "string" },
        ifsccode: { type: "string" },
        is_gst: { type: "boolean" },
        franchise_type: { type: "integer" },
        franchise_type_name: { type: "string" },
        balance: { type: "number" },
        credit_limit: { type: "number" },
        limitation: { type: "number" },
        wallet_balance: { type: "number" },
        for_indent: { type: "integer" },
        warehouse_id: { type: "integer" },
        warehouse_name: { type: "string" },
        is_active: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletInfoSchema;
