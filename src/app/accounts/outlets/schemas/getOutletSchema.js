const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletSchema = {
  tags: ["ROLE"],
  summary: "This API is to get roles",
  headers: { $ref: "request-headers#" },
  queryString: {
    type: "object",
    required: ["status", "search"],
    additionalProperties: false,
    properties: {
      status: { type: "integer", enum: [0, 1, 2], default: 0 },
      search: { type: "string", default: "" }
    },
  },
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
              short_name: { type: "string" },
              fullname: { type: "string" },
              add1: { type: "string" },
              add2: { type: "string" },
              add3: { type: "string" },
              add4: { type: "string" },
              pincode: { type: "string" },
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
              outlet_type_name: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              bankacno: { type: "string" },
              bankname: { type: "string" },
              acname: { type: "string" },
              ifsccode: { type: "string" },
              is_gst: { type: "boolean" },
              franchise_type: { type: "integer" },
              franchise_type_name: {
                type: "object",
                properties: {
                  id: { type: ["integer", "null"] },
                  name: { type: ["string", "null"] }
                }
              },
              balance: { type: "string" },
              credit_limit: { type: "string" },
              limitation: { type: "string" },
              wallet_balance: { type: "string" },
              ref_doc_no: { type: ["string", "null"] },
              for_indent: { type: "integer" },
              warehouse_id: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  short_name: { type: "string" },
                  warehouse_name: { type: "string" },
                  add1: { type: "string" },
                  add2: { type: "string" },
                  add3: { type: "string" },
                  add4: { type: "string" },
                  pincode: { type: "string" },
                  phone: { type: "string", pattern: "^[0-9]{10,12}$" },
                  mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
                  email: { type: "string", format: "email" },
                  gstin: { type: "string" },
                  fssai: { type: "string" },
                  bankacno: { type: "string" },
                  bankname: { type: "string" },
                  ifsccode: { type: "string" },
                  acname: { type: "string" },
                  is_gst: { type: "boolean" },
                  limitation: { type: "integer" },
                  wallet_balance: { type: "integer" },
                  is_active: { type: "boolean" },
                  contact_name: { type: "string" },
                  main_warehouse: { type: "boolean" }
                }
              },
              is_active: { type: "boolean" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              created_by: { type: "integer" },
              updated_by: { type: ["integer", "null"] },
              country: {
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
              city: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
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
                page_size: { type: ["integer", "string"] },
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

module.exports = getOutletSchema;
