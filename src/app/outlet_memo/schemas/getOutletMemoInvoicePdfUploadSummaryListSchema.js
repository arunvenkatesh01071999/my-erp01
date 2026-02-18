const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const getOutletMemoInvoicePdfUploadSummaryListSchema = {
    tags: ["OUTLET PURCHASE MEMO"],
    summary: "API to get outlet-user-wise purchase memo list",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        properties: {
            outlet_id: { type: "integer" }
        },
        required: ["outlet_id"]
    },

    querystring: {
        type: "object",
        properties: {
            page: { type: "integer", minimum: 1, default: 1 },
            pageSize: { type: "integer", minimum: 1, maximum: 100, default: 10 }
        }
    },

    response: {
        200: {
            type: "object",
            required: ["meta", "data"],
            properties: {
                meta: {
                    type: "object",
                    required: ["total", "page", "pageSize", "totalPages"],
                    properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        pageSize: { type: "number" },
                        totalPages: { type: "number" }
                    }
                },

                data: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [
                            "memo_no",
                            "memo_date",
                            "pono",
                            "podate",
                            "party_invoice_no",
                            "party_invoice_date",
                            "invoice",
                            "image_url",
                            "is_invoice_pdf",
                            "invoice_remark",
                            "outlet_name",
                            "supplier_id",
                            "supplier_name",
                            "user_name"
                        ],
                        properties: {
                            memo_no: { type: "string" },
                            memo_date:  { type: "string", format: "date" },
                            pono: { type: "string" },
                            podate:  { type: "string", format: "date" },
                            party_invoice_no: { type: "string" },
                            party_invoice_date:  { type: "string", format: "date" },
                            invoice: { type: "number" },
                            image_url: { type: ["string", "null"] },
                            is_invoice_pdf: { type: "boolean" },
                            invoice_remark: { type: ["string", "null"] },
                            outlet_name: { type: ["string", "null"] },
                            supplier_id: { type: "number" },
                            supplier_name: { type: ["string", "null"] },
                            user_name: { type: ["string", "null"] }
                        }
                    }
                }
            }
        },

        ...errorSchemas
    }
};

module.exports = getOutletMemoInvoicePdfUploadSummaryListSchema;
