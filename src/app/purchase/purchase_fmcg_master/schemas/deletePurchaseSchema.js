const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const deletePurchaseMasterSchema = {
  tags: ["Purchase Master Schema"],
  summary: "This API is to Delete Purchase Master",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["docno"], // Ensuring docno is mandatory
    properties: {
      docno: {
        type: "string",
        errorMessage: "docno must be a string"
      }
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

module.exports = deletePurchaseMasterSchema;
