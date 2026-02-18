const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteVendorMailSchema = {
  tags: ["VENDOR MAIL"],
  summary: "API to delete a vendor mail",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    },
    required: ["id"]
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

module.exports = deleteVendorMailSchema;
