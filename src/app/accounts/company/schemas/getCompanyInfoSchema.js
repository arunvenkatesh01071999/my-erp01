const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCompanyInfoSchema = {
  tags: ["COMPANYs INFO"],
  summary: "This API is to get company information",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" }
    }
  },

  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        code: { type: "string" },
        company_short_name: { type: "string" },
        company_fullname: { type: "string" },
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
        bank_details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              bankacno: { type: "string" },
              bankname: { type: "string" },
              acname: { type: "string" },
              ifsccode: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCompanyInfoSchema;
