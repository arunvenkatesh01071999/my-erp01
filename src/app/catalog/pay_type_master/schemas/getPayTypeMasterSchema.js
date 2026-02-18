const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getPayTypeMasterSchema = {
  tags: ["PayType Master"],
  summary: "This API is to get PayType Master",
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
              pay_type_name: { type: "string" },
              pay_type_key: { type: "string" },
              is_active: { type: "boolean" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
  // response: {
  //   200: {
  //     type: "array",
  //     items: {
  //       type: "object",
  //       properties: {
  //         id: { type: "integer" },
  //         pay_type_name: { type: "string" },
  //         pay_type_key: { type: "string" },
  //         is_active: { type: "boolean" }
  //       }
  //     }
  //   },
  //   ...errorSchemas
  // }
};

module.exports = getPayTypeMasterSchema;
