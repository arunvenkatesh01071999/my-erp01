const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteCompanySchema = {
  tags: ["DELETE COMPANY"],
  summary: "This API is to delete company",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteCompanySchema;
