const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSalesManSchema = {
  tags: ["SalesMan"],
  summary: "This API is to update SalesMan",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      salesMenId: { type: "integer" }
    }
  },
  body: {
    type: "object",
    required: [
      "dob",
      "sales_man_code",
      "sex",
      "sales_man_name",
      "father_name",
      "mother_name",
      "is_active",
      "company_id"
    ],
    properties: {
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
      is_active: { type: "boolean" }
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

module.exports = putSalesManSchema;
