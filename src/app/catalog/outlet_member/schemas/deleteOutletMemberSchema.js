const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteOutletMemberSchema = {
  tags: ["OutletMember"],
  summary: "This API is to delete OutletMember",
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
        success: { type: "boolean" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteOutletMemberSchema;
