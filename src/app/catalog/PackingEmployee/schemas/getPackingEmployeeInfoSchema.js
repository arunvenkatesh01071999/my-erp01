const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingEmployeeInfoSchema = {
  tags: ["PackingEmployee"],
  summary: "This API is to get units",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        city: { type: "string" },
        mobile_number: { type: "string" },
        company_id: { type: "integer" },
        is_active: { type: "boolean" },
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingEmployeeInfoSchema;
