const { format } = require("mysql");
const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSupplierPaginateSchema = {
  tags: ["SUPPLIER"],
  summary: "This API is to get SUPPLIER",
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
              supplier_code: { type: "string" },
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
              fssai: { type: "string" },
              fssai_expiry: { type: "string", format: "date" },
              pan_status: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              gst_status: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" }
                }
              },
              is_dsd: {
                type: "integer"
              },
              supplier_creation_date: { type: "string", format: "date" },
              msme_applicable: { type: "boolean" },
              msme_number: { type: "string" },
              msme_declaration: { type: "string" },
              credit_days: { type: "integer" },
              tot_margin_percentage: { type: "number" },
              tot_margin_value: { type: "number" },
              contact_person: { type: "string" },
              designation: { type: "string" },
              alter_mobile_no: { type: "string" },
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
                  properties: {
                    id: { type: "integer" },
                    code: { type: "string" },
                    short_name: { type: "string" },
                    fullname: { type: "string" },
                    opening_stock: { type: "number", nullable: true },
                    balance_stock: { type: "number", nullable: true },
                    min_stock: { type: "number", nullable: true },
                    allow_neg_stk: { type: "boolean", nullable: true },
                    wscale: { type: "boolean", nullable: true },
                    outlet_purchase: { type: "boolean", nullable: true },
                    outlet_non_saleable: { type: "boolean", nullable: true },
                    local_outlet_purchase: { type: "boolean", nullable: true }
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
                    contact_name: { type: "string" },
                    warehouse_stock: { type: "number" },
                    warehouse_is_active: { type: "boolean" }
                  }
                }
              },
              documents: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    document_name: { type: "string" },
                    path_url: { type: "string" }
                  }
                }
              },
              cheque: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    document_name: { type: "string" },
                    path_url: { type: "string" }
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

module.exports = getSupplierPaginateSchema;
