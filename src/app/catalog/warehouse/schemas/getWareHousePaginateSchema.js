const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getConsumerPaginateSchema = {
  tags: ["WAREHOUSE"],
  summary: "This API is to get WareHouse",
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
              warehouse_name: { type: "string" },
              short_name: { type: "string" },
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
              phone: { type: "string" },
              mobile: { type: "string" },
              email: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" },
              limitation: { type: "number" },
              gstin: { type: "string" },
              fssai: { type: "string" },
              bankacno: { type: "string" },
              bankname: { type: "string" },
              acname: { type: "string" },
              ifsccode: { type: "string" },
              is_gst: { type: "boolean" },
              wallet_balance: { type: "number" },
              main_warehouse: { type: "boolean" },
              contact_name: { type: "string" },
              company_details: {
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
              }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getConsumerPaginateSchema;
