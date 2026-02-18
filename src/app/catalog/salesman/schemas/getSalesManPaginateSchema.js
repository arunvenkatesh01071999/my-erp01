const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesManPaginateSchema = {
  tags: ["SalesMan"],
  summary: "This API is to get SalesMan",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      page_size: { type: "integer" },
      current_page: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
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
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getSalesManPaginateSchema;
