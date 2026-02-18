const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAccountMasterSchema = {
  tags: ["ACCOUNTMASTER"],
  summary: "This API is to get AccountMaster",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          acname: { type: "string" },
          actype_id: { type: "integer" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getAccountMasterSchema;
