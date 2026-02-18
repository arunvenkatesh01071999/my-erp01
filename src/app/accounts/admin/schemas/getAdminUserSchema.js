const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAdminUserSchema = {
  tags: ["ADMIN USERS"],
  summary: "This API is to get admin users",
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
              user_name: { type: "string" },
              user_email: { type: "string" },
              user_mobile: { type: "string" },
              user_type: {
                type: "integer",
                enum: [0, 1, 2] // Define the allowed values here
              },
              is_active: { type: "boolean" },
              outlets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    short_name: { type: "string" },
                    fullname: { type: "string" },
                    opening_stock: { type: "number", nullable: true },
                    balance_stock: { type: "number", nullable: true },
                    min_stock: { type: "number", nullable: true },
                    allow_neg_stk: { type: "boolean", nullable: true },
                    wscale: { type: "boolean", nullable: true },
                    outlet_purchase: { type: "boolean", nullable: true },
                    outlet_non_saleable: { type: "boolean", nullable: true }
                  }
                }
              },
              outlet_roles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    role_name: { type: "string" },
                    company_id: { type: "integer" },
                    is_active: { type: "boolean" },
                    is_outlet: { type: "boolean" },
                    is_warehouse: { type: "boolean" }
                  }
                }
              },
              warehouse: {
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
                    city_name: { type: "string" },
                    city_id: { type: "integer" },
                    pincode: { type: "string" },
                    state_name: { type: "string" },
                    state_id: { type: "integer" },
                    country_name: { type: "string" },
                    country_id: { type: "integer" },
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
                    contact_name: { type: "string" }
                  }
                }
              },
              warehouse_roles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    role_name: { type: "string" },
                    company_id: { type: "integer" },
                    is_active: { type: "boolean" },
                    is_outlet: { type: "boolean" },
                    is_warehouse: { type: "boolean" }
                  }
                }
              },
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
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getAdminUserSchema;
