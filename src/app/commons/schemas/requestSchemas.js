const headers = {
  $id: "request-headers",
  type: "object",
  required: ["x-channel-id"],
  properties: {
    Authorization: { type: "string" },
    "x-channel-id": {
      type: "string",
      default: "WEB",
      enum: ["AND", "WEB", "STORE", "IOS"],
      description: "Example values: 'APP'"
    }
  }
};

const auditSchema = {
  $id: "request-audit",
  type: "object",
  additionalProperties: false,
  properties: {
    api_version: { type: "string" },
    created_by: { type: "string" },
    created_at: { type: "string", format: "date-time" },
    updated_by: { type: "string" },
    updated_at: { type: "string", format: "date-time" }
  }
};

exports.commonRequestSchemas = [auditSchema, headers];
