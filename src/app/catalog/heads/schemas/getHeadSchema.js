const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getHeadSchema = {
  tags: ["HEAD"],
  summary: "This API is to get Heads",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          cateogory_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getHeadSchema;
