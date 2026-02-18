const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const adminUserInfoSchema = {
  tags: ["USER'S INFO"],
  summary: "This API is to get users information",
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
        user_name: { type: "string" },
        user_email: { type: "string" },
        user_mobile: { type: "string" },
        user_password: { type: "string" },
        user_type: {
          type: "integer",
          enum: [0, 1, 2]
        },
        is_active: { type: "boolean" },
        roles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              role_name: { type: "string" }
            }
          }
        },
        outlets: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              code: { type: "string" },
              short_name: { type: "string" },
              fullname: { type: "string" }
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
              warehouse_short_name: { type: "string" }
            }
          }
        },
        salesmandetails: {
          type: "object",
          properties: {
            id: { type: "integer" },
            sales_man_code: { type: "string" },
            sales_man_name: { type: "string" },
            company_id: { type: "integer" },
            code: { type: "string" },
            short_name: { type: "string" },
            mobile: { type: "string" },
            father_name: { type: "string" },
            mother_name: { type: "string" },
            dob: { type: "string" },
            sex: { type: "string" },
            add1: { type: "string" },
            add2: { type: "string" },
            add3: { type: "string" },
            photo: { type: "string" },
            id_proof: { type: "string" },
            passbook: { type: "string" },
            is_active: { type: "boolean" }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = adminUserInfoSchema;


