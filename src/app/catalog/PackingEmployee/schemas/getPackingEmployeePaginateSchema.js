const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPackingEmployeePaginateSchema = {
  tags: ["PackingEmployee"],
  summary: "This API is to get PackingEmployee",
  headers: { $ref: "request-headers#" },

  queryString: {
    type: "object",
    required: ["status", "search"],
    additionalProperties: false,
    properties: {
      status: { type: "integer", enum: [0, 1, 2], default: 0 },
      search: { type: "string", default: "" }
    },
  },

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
              name: { type: "string" },
              city: { type: "string" },
              mobile_number: { type: "string" },
              company_id: { type: "integer" },
              is_active: { type: "boolean" },
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getPackingEmployeePaginateSchema;
