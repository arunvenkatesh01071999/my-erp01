const { format } = require("mysql");
const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCustomerPaginateSchema = {
  tags: ["CUSTOMER"],
  summary: "This API is to get CUSTOMER",
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
              customer_code: { type: "string" },
              name: {
                type: "string",
              },
              short_name: {
                type: "string",
              },
              group_id: { type: "integer" },
              allocate_group: { type: "integer" },

              address1: { type: "string" },
              address2: { type: "string" },

              country_id: { type: "integer" },
              country_name: { type: "string" },
              state_id: { type: "integer" },
              state_name: { type: "string" },
              city_id: { type: "integer" },
              city_name: { type: "string" },
              state_code: { type: "integer" },

              pincode: { type: "integer" },

              phone: { type: "string" },
              mobile: { type: "string" },

              email: { type: "string" },
              website: { type: "string" },

              gstin: { type: "string" },
              cst: { type: "string" },

              pan_number: { type: "string" },

              opening_balance: { type: "number" },
              balance: { type: "number" },

              web_id: { type: "integer" },
              location_id: { type: "integer" },
              warehouse_id: { type: "integer" },

              export: { type: "number" },
              sales_margin: { type: "number" },

              customer_type: { type: "integer" },
              gst_type: { type: "integer" },

              default_cash_sales: { type: "integer" },
              web_order: { type: "integer" },
              web_sales_export: { type: "integer" },
              bulk_sales: { type: "integer" },
              grocery_tray: { type: "integer" },
              margin_active: { type: "integer" },

              delivery_address1: { type: "string" },
              delivery_address2: { type: "string" },
              delivery_country_id: { type: "integer" },
              delivery_country_name: { type: "string" },

              delivery_state_id: { type: "integer" },
              delivery_state_name: { type: "string" },

              delivery_city_id: { type: "integer" },
              delivery_city_name: { type: "string" },

              delivery_pincode: { type: "integer" },
              delivery_state_code: { type: "integer" },

              status: { type: "integer" },

        is_active: { type: "boolean" },

              company_id: { type: "integer" },
              user_id: { type: "integer" },
              wh_id: { type: "integer" },
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

            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getCustomerPaginateSchema;
