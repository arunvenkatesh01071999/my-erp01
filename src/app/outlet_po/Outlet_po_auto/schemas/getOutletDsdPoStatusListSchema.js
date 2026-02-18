const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getOutletDsdPoStatusListSchema = {
  tags: ["Outlet PO Status"],
  summary: "Get Outlet DSD PO Status List",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["from_date", "to_date", "company_id"],
    additionalProperties: false,
    properties: {
      from_date: { type: "string", format: "date" },
      to_date: { type: "string", format: "date" },
      company_id: { type: "integer" },
      region_id: { type: "integer" },
      outlet_id: { type: "array", items: { type: "integer" } },
      page_size: { type: "integer", default: 10 },
      current_page: { type: "integer", default: 1 }
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
              outlet_id: { type: "integer" },
              po_date: { type: "string", format: "date" },
              outlet_full_name: { type: "string" },
              outlet_short_name: { type: "string" },
              region_id: { type: "integer" },
              region_name: { type: "string" },
              po_generated_count: { type: "string" },
              po_approval_count: { type: "string" },
              po_memo_count:{ type: "string" },
              po_grn_normal_count: { type: "string" },
              po_grn_qty_mismatch_count: { type: "string" },
              po_iv_count: { type: "string" },
              po_debit_note_count: { type: "string" },
              po_grn_count: { type: "string" }
              
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
                page_size: { type: "integer" },
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

module.exports = getOutletDsdPoStatusListSchema;
