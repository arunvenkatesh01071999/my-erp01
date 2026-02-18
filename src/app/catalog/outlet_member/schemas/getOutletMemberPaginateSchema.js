const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletMemberPaginateSchema = {
  tags: ["OutletMember"],
  summary: "This API is to get OutletMember",
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
              mobile: { type: "string" },
              party_name: { type: "string" },
              address: { type: "string" },
              spouse_name: { type: "string" },
              spouse_dob: { type: "string" },
              party_dob: { type: "string" },
              anniversary_date: { type: "string" },
              no_of_child: { type: "integer" },
              gst_in: { type: "string" },
              balance_points: { type: "number" },
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

module.exports = getOutletMemberPaginateSchema;
