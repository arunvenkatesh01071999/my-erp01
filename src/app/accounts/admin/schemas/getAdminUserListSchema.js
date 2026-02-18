const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAdminUserListSchema = {
  tags: ["ADMIN USERS LIST"],
  summary: "This API is to get admin users list",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      company_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_name: { type: "string" },
          user_email: { type: "string" },
          user_mobile: { type: "string" },
          user_type: {
            type: "integer"
          },
          is_active: { type: "boolean" },
          // outlets: {
          //   type: "array",
          //   items: {
          //     type: "object",
          //     properties: {
          //       id: { type: "integer" },
          //       short_name: { type: "string" },
          //       fullname: { type: "string" },
          //       opening_stock: { type: "number", nullable: true },
          //       balance_stock: { type: "number", nullable: true },
          //       min_stock: { type: "number", nullable: true },
          //       allow_neg_stk: { type: "boolean", nullable: true },
          //       wscale: { type: "boolean", nullable: true },
          //       outlet_purchase: { type: "boolean", nullable: true },
          //       outlet_non_saleable: { type: "boolean", nullable: true }
          //     }
          //   }
          // },
          // outlet_roles: {
          //   type: "array",
          //   items: {
          //     type: "object",
          //     properties: {
          //       id: { type: "integer" },
          //       role_name: { type: "string" },
          //       company_id: { type: "integer" },
          //       is_active: { type: "boolean" },
          //       is_outlet: { type: "boolean" },
          //       is_warehouse: { type: "boolean" }
          //     }
          //   }
          // },
          // warehouse: {
          //   type: "array",
          //   items: {
          //     type: "object",
          //     properties: {
          //       id: { type: "integer" },
          //       warehouse_name: { type: "string" },
          //       short_name: { type: "string" },
          //       add1: { type: "string" },
          //       add2: { type: "string" },
          //       add3: { type: "string" },
          //       add4: { type: "string" },
          //       city_name: { type: "string" },
          //       city_id: { type: "integer" },
          //       pincode: { type: "string" },
          //       state_name: { type: "string" },
          //       state_id: { type: "integer" },
          //       country_name: { type: "string" },
          //       country_id: { type: "integer" },
          //       phone: { type: "string" },
          //       mobile: { type: "string" },
          //       email: { type: "string" },
          //       company_id: { type: "integer" },
          //       is_active: { type: "boolean" },
          //       limitation: { type: "number" },
          //       gstin: { type: "string" },
          //       fssai: { type: "string" },
          //       bankacno: { type: "string" },
          //       bankname: { type: "string" },
          //       acname: { type: "string" },
          //       ifsccode: { type: "string" },
          //       is_gst: { type: "boolean" },
          //       wallet_balance: { type: "number" },
          //       main_warehouse: { type: "boolean" },
          //       contact_name: { type: "string" }
          //     }
          //   }
          // },
          // warehouse_roles: {
          //   type: "array",
          //   items: {
          //     type: "object",
          //     properties: {
          //       id: { type: "integer" },
          //       role_name: { type: "string" },
          //       company_id: { type: "integer" },
          //       is_active: { type: "boolean" },
          //       is_outlet: { type: "boolean" },
          //       is_warehouse: { type: "boolean" }
          //     }
          //   }
          // },
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getAdminUserListSchema;
