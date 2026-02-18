const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSubAccountsSchema = {
  tags: ["CATEGORY"],
  summary: "This API is to fetch sub categories",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          sub_account_name: { type: "string" },
          acc_id: { type: "integer" },
          acname: { type: "string" },
          is_active: { type: "boolean" }
        }
      },
      meta: { $ref: "response-meta#" }
    },

    ...errorSchemas
  }
};

module.exports = getSubAccountsSchema;
