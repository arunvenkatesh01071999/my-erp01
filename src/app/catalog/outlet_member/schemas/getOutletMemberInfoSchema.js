const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletMemberInfoSchema = {
  tags: ["OutletMember INFO"],
  summary: "This API is to get OutletMember Info",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" }
    }
  },

  response: {
    200: {
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
        balance_points: { type: "number" }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletMemberInfoSchema;
