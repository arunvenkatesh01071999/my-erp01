const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingEmployeeSchema = {
  tags: ["PackingEmployee"],
  summary: "This API is to get Packing Employee",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          city: { type: "string" },
          mobile_number: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" },
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingEmployeeSchema;
