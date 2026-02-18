const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletMemberSchema = {
  tags: ["OutletMember"],
  summary: "This API is to get OutletMember",
  headers: { $ref: "request-headers#" },
  response: {
    200: {
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
          balance_points: { type: "number" }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = getOutletMemberSchema;
