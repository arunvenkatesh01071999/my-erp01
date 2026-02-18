const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postAccountMasterSchema = {
  tags: ["AccountMaster"],
  summary: "This API is to post AccountMaster",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["acname", "actype_id","company_id", "is_active"],
    properties: {
      acname: { type: "string" },
      company_id: { type: "integer" },
      actype_id: { type: "integer" },
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

module.exports = postAccountMasterSchema;
