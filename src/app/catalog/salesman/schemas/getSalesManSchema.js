const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesManSchema = {
  tags: ["SalesMan"],
  summary: "This API is to get SalesMan",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          sales_man_code: { type: "string" },
          sales_man_name: { type: "string" },
          company_id: { type: "integer" },
          code: { type: "string" },
          short_name: { type: "string" },
          mobile: { type: "string" },
          father_name: { type: "string" },
          mother_name: { type: "string" },
          dob: { type: "string" },
          sex: { type: "string" },
          add1: { type: "string" },
          add2: { type: "string" },
          add3: { type: "string" },
          photo: { type: "string" },
          id_proof: { type: "string" },
          passbook: { type: "string" },
          is_active: { type: "boolean" }
        }

      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesManSchema;
