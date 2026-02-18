const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const adminLoginSchema = {
  tags: ["ADMIN LOGIN"],
  summary: "This API is to login admin users",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        token: { type: "string" },
        user_type: { type: "integer" },
        outlet: {
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
              country_id: { type: "integer" },
              state_id: { type: "integer" },
              city_id: { type: "integer" },
              phone: { type: "string" },
              mobile: { type: "string" },
              email: { type: "string" },
              website: { type: "string" },
              gstin: { type: "string" },
              fssai: { type: "string" },
              outlet_type: { type: "integer" },
              bankacno: { type: ["string", "null"] },
              bankname: { type: ["string", "null"] },
              acname: { type: ["string", "null"] },
              ifsccode: { type: ["string", "null"] },
              company_id: { type: "integer" },
              is_gst: { type: "boolean" },
              franchise_type: { type: "integer" },
              balance: { type: "string" },
              credit_limit: { type: "string" },
              limitation: { type: "string" },
              wallet_balance: { type: "string" },
              ref_doc_no: { type: ["string", "null"] },
              for_indent: { type: "integer" },
              warehouse_id: { type: "integer" },
              is_active: { type: "boolean" },
              bankid: { type: "string" }
            }
          }
        },
        warehouse: {
          type: "array",
          items: {
            type: "object",
            properties: {
              warehouse_id: { type: "integer" },
              warehouse_name: { type: "string" },
              warehouse_short_name: { type: "string" },
              is_active: { type: "boolean" }
            }
          }
        }
      },
      required: ["success", "token", "user_type", "outlet", "warehouse"]
    },
    ...errorSchemas
  }
};

module.exports = adminLoginSchema;
