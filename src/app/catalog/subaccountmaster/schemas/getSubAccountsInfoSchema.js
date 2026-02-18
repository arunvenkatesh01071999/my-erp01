const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubAccountsInfoSchema = {
  tags: ["SUB CATEGORY INFO"],
  summary: "This API is to fetch sub categories info ",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      subaccount_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        sub_account_name: { type: "string" },
        acc_id: { type: "integer" },
        acname: { type: "string" },
        is_active: { type: "boolean" }
      }
    },

    ...errorSchemas
  }
};

module.exports = getSubAccountsInfoSchema;
