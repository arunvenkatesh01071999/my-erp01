const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const phonePayHistoryLogSchema = {
  tags: ["Phone Pay History Log"],
  summary: "This API is to get phone pay history log",
  headers: { $ref: "request-headers#" },
  params: {
    type: "object",
    required: ["page_size", "current_page", "phone_no"],
    properties: {
      page_size: { type: "integer", minimum: 1 },
      current_page: { type: "integer", minimum: 1 },
      phone_no: { type: "string" },
      transaction_id: { type: "string" }
    }
  },
  body: {
    type: "object",
    required: ["from_date", "to_date"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" }
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
              docno: { type: "string" },
              transaction_date: { type: "string", format: "date" },
              merchant_order_id: { type: "string" },
              transaction_id: { type: "string" },
              response_json: { type: "string" },
              request_json: { type: "string" },
              phone_no: { type: "string" },
              is_active: { type: "boolean" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              created_by: { type: ["integer", "null"] },
              updated_by: { type: ["integer", "null"] }
            }
          }
        },
        meta: {
          type: "object",
          properties: {
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer" },
                page: { type: "integer" },
                page_size: { type: "string" },
                total_pages: { type: "integer" }
              }
            }
          }
        }
      }
    },
    ...errorSchemas
  }
};

module.exports = phonePayHistoryLogSchema;
