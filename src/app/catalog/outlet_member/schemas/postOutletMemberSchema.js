const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postOutletMemberSchema = {
  tags: ["OutletMember"],
  summary: "This API is to post OutletMember",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      "mobile",
      "party_name"
    ],
    properties: {
      mobile: { type: "string" },
      party_name: { type: "string" },
      address: { type: "string" },
      spouse_name: { type: "string" },
      spouse_dob: { type: "string" },
      party_dob: { type: "string" },
      anniversary_date: { type: "string" },
      no_of_child: { type: "integer" },
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

module.exports = postOutletMemberSchema;
