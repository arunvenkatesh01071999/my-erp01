const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletListBySupplierSchema = {
  tags: ["Outlet List By Supplier"],
  summary: "This API is to get outlet list by supplier",
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
          code: { type: "string" },
          short_name: { type: "string" },
          fullname: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletListBySupplierSchema;
