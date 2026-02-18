const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCompanySchema = {
  tags: ["COMPANY"],
  summary: "This API is to get company",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" },
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
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
              city: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              pincode: { type: "string" },
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
              phone: { type: "string", pattern: "^[0-9]{10,12}$" },
              mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
              email: { type: "string", format: "email" },
              website: {
                type: "string",
                pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
              },
              gstin: { type: "string" },
              fssai: { type: "string" },
              is_active: { type: "boolean" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              created_by: { type: "integer" },
              updated_by: { type: "integer" },
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
                    is_active: { type: "boolean" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                    created_by: { type: "integer" },
                    updated_by: { type: "integer" }
                  }
                }
              }
            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer" },
                page: { type: "integer" },
                page_size: { type: "string" },
                total_pages: { type: "integer" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCompanySchema;
