const { errorSchemas } = require("../../../commons/schemas/errorSchemas");


const getTypedesignCurrendaySchema = {
  tags: ["TYPEDESIGN"],
  summary: "This API is to get Typedesign",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      typedesign_id: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          type_name: { type: "string" },
          company_id: { type: "integer" },
          is_active: { type: "boolean" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getTypedesignCurrendaySchema;
