const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const putPoSettingSchema = {
  tags: ["Purchase Order"],
  summary: "This API is to update unapproved purchase orders",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    // required: ["un_approved_pono"],
    // properties: {
    //   type: "object",
    required: ["purchase_order"],
    properties: {
      purchase_order: { type: "boolean" },
    },
    // },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
      },
    },
    ...errorSchemas,
  },
};

module.exports = putPoSettingSchema;
