const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletMemberSchema = {
  tags: ["Outlet Member"],
  summary: "This API is to get Outlet Member",
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
              mobile: { type: "string" },
              party_name: { type: "string" },
              address: { type: "string" },
              gst_in: { type: "string" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
              created_by: { type: "string" },
              updated_by: { type: "string" },
              balance_points: { type: "string" }
            }
          }
        },
        meta: { $ref: "response-meta#" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletMemberSchema;
