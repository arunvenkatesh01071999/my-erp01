const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const countriesSchema = {
  tags: ["Fetch Countries"],
  summary: "This API is used to fetch Countries",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          shortname: { type: "string" },
          name: { type: "string" },
          phonecode: { type: "string" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = countriesSchema;
