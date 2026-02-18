const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postAdminUserSchema = {
  tags: ["USERS CREATION"],
  summary: "This API is to post users",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "user_name",
      "user_email",
      "user_mobile",
      "user_password",
      "company_id",
      "user_type"
    ],
    properties: {
      user_name: {
        type: "string",
        // pattern: "^[a-zA-Z ]{3,50}$",
        // errorMessage: "User name must be 3-50 characters long and contain only letters and spaces"
      },
      user_email: {
        type: "string",
        // format: "email",
        // errorMessage: "Invalid email format"
      },
      user_mobile: {
        type: "string",
        // pattern: "^[0-9]{10}$",
        // errorMessage: "User mobile must be exactly 10 digits"
      },
      user_password: {
        type: "string",
        // pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$",
        // errorMessage: "Password must be at least 8 characters long, including 1 letter and 1 number"
      },
      user_type: {
        type: "integer",
        enum: [0, 1, 2],
        errorMessage: "User type must be 0, 1, or 2"
      },
      company_id: {
        type: "integer",
        errorMessage: "Company ID must be an integer"
      },
      outlets_roles: {
        type: "array",
        items: {
          type: "object",
          required: ["role_id"],
          properties: {
            role_id: {
              type: "integer",
              errorMessage: "Role ID must be an integer"
            }
          }
        }
      },
      outlets: {
        type: "array",
        items: {
          type: "object",
          required: ["outlet_id"],
          properties: {
            outlet_id: {
              type: "integer",
              errorMessage: "Outlet ID must be an integer"
            }
          }
        }
      },
      warehouse: {
        type: "array",
        items: {
          type: "object",
          required: ["warehouse_id"],
          properties: {
            warehouse_id: {
              type: "integer",
              errorMessage: "Warehouse ID must be an integer"
            }
          }
        }
      },
      warehouse_roles: {
        type: "array",
        items: {
          type: "object",
          required: ["role_id"],
          properties: {
            role_id: {
              type: "integer",
              errorMessage: "Role ID must be an integer"
            }
          }
        }
      },
      company_details: {
        type: "array",
        items: {
          type: "object",
          required: ["company_id"],
          properties: {
            company_id: { type: "integer" }
          }
        }
      },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postAdminUserSchema;
