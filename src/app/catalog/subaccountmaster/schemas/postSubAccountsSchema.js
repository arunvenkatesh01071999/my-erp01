const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postSubAccountsSchema = {
  tags: ["CATEGORY"],
  summary: "This API is to post categories",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "sub_account_name",
      "acc_id",
      "is_active"
    ],
    properties: {
      sub_account_name: { type: "string" },
      acc_id: { type: "integer" },
      is_active: { type: "boolean" }
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

module.exports = postSubAccountsSchema;
