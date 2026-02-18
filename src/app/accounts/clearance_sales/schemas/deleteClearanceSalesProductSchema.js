const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deleteClearanceSalesProductSchema = {
  tags: ["DELETE ClearanceSalesProduct"],
  summary: "This API is to delete ClearanceSalesProduct",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      doc_no: { type: "integer" },
      outlet_id: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
         message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = deleteClearanceSalesProductSchema;
