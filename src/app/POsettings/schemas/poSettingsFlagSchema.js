const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const poSettingsFlagSchema = {
  tags: ["UPDATE FLAG PO DETAILS"],
  summary: "This API is to update flag of po details",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["Locid", "Code", "Flag"],
    properties: {
      Locid: { type: "integer" },
      Code: { type: "integer" },
      Flag: { type: "integer" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = poSettingsFlagSchema;
