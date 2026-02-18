const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getCategoryWiseSalesSchema = {
  tags: ["Item"],
  summary: "This API is to get Item",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              head: { type: "integer" },
              type_id: { type: "integer" },
              cat_id: { type: "integer" },
              subcat_id: { type: "integer" },
              cash: { type: "number" },
              credit: { type: "number" },
              sales: { type: "number" },
              purchase: { type: "number" }
            }
          }
        },
        meta: {
          type: "object",
          $ref: "response-meta#"
        }
      }
    },
    ...errorSchemas
  }
};


module.exports = getCategoryWiseSalesSchema;


