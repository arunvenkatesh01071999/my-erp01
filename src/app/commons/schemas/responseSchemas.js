const amountSchema = {
  $id: "response-amount",
  type: "object",
  properties: {
    currency: { type: "string" },
    cent_amount: { type: "integer" },
    fraction: { type: "integer" }
  }
};

const auditSchema = {
  $id: "response-audit",
  type: "object",
  properties: {
    api_version: { type: "string" },
    created_by: { type: "string" },
    created_at: { type: "string" },
    updated_by: { type: "string" },
    updated_at: { type: "string" }
  }
};

const metaSchema = {
  $id: "response-meta",
  type: "object",
  properties: {
    pagination: {
      type: "object",
      properties: {
        total: { type: "number" },
        page: { type: "number" },
        page_size: { type: "number" },
        total_pages: { type: "number" }
      }
    }
  }
};

exports.commonResponseSchemas = [amountSchema, auditSchema, metaSchema];
