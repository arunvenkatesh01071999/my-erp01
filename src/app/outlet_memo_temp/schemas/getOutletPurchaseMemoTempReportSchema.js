const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletPurchaseMemoTempReportSchema = {
  tags: ["Outlet PO Status"],
  summary: "Get Outlet DSD PO Status List",
  headers: { $ref: "request-headers#" },

  body: {
    type: "object",
    required: ["from_date", "to_date", "company_id", "region_id"],
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
            required: [
              "supplier_id",
              "supplier_name",
              "user_id",
              "user_name",
              "outlet_id",
              "outlet_full_name",
              "region_id",
              "region_name",
              "id",
              "po_no",
              "po_date",
              "memo_no",
              "memo_date",
              "invoice_no",
              "invoice_date",
              "invoice_amount",
              "purchase_memo_temp_lines"
            ],

            properties: {
              supplier_id: { type: "integer" },

              supplier_name: { type: "string" },

              user_id: { type: "integer" },

              user_name: { type: "string" },

              outlet_id: { type: "integer" },

              outlet_full_name: { type: "string" },

              region_id: { type: "integer" },

              region_name: { type: "string" },

              id: { type: "integer" },

              po_no: { type: "string" },

              po_date: {
                type: "string",
                format: "date"
              },

              memo_no: { type: "string" },

              memo_date: {
                type: "string",
                format: "date"
              },

              invoice_no: { type: "string" },

              invoice_date: {
                type: "string",
                format: "date"
              },

              invoice_amount: {
                type: "number"
              },

              image_url: {
                type: ["string", "null"]
              },

              purchase_memo_temp_lines: {
                type: "array",
                items: {
                  type: "object",
                  required: [
                    "prod_id",
                    "prod_code",
                    "uom_id",
                    "po_qty",
                    "memo_qty",
                    "po_mrp",
                    "memo_mrp",
                    "memo_return_qty",
                    "pro_name",
                    "units_short_name"
                  ],

                  properties: {
                    prod_id: { type: "integer" },

                    prod_code: { type: "string" },

                    uom_id: { type: "integer" },

                    po_qty: { type: "number" },

                    memo_qty: { type: "number" },

                    po_mrp: { type: "number" },

                    memo_mrp: { type: "number" },

                    memo_return_qty: { type: "number" },

                    pro_name: { type: "string" },

                    units_short_name: { type: "string" }
                  }
                }
              }
            }
          }
        },

        pagination: {
          type: "object",
          required: ["total", "page", "page_size", "total_pages"],
          properties: {
            total: { type: "integer" },

            page: { type: "integer" },

            page_size: { type: "integer" },

            total_pages: { type: "integer" }
          }
        }
      }
    },

    ...errorSchemas
  }


};

module.exports = getOutletPurchaseMemoTempReportSchema;
