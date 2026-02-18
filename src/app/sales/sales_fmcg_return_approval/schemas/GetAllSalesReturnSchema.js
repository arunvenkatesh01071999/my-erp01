const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getAllSalesReturnSchema = {
    tags: ["Sales Return"],
    summary: "Get all Sales Return records with customer name",
    headers: { $ref: "request-headers#" },

    queryString: {
        type: "object",
        additionalProperties: false,
        properties: {
            search: { type: "string", default: "" },
            from_date: { type: "string", format: "date-time" },
            to_date: { type: "string", format: "date-time" },
        }
    },

    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
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
                            financial_year: { type: "string" },
                            docno: { type: "integer" },
                            docdate: { type: "string", format: "date-time" },
                            customer_id: { type: "integer" },
                            total: { type: "string" },
                            discount: { type: "string" },
                            vat_cst_amt: { type: "string" },
                            grand_total: { type: "string" },
                            invoice_no: { type: "string" },
                            sales_doc_id: { type: "integer" },
                            round_off: { type: "string" },
                            type: { type: "integer" },
                            app_flag: { type: "integer" },
                            cess_amt: { type: "string" },
                            sale_type: { type: "integer" },
                            gst: { type: "integer" },
                            igst: { type: "integer" },
                            remark: { type: "string" },
                            verify_id: { type: ["integer", "null"] },
                            einvoice: { type: ["string", "null"] },
                            akno: { type: ["string", "null"] },
                            ak_date: { type: ["string", "null"], format: "date-time" },
                            irnno: { type: ["string", "null"] },
                            company_id: { type: "integer" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: ["string", "null"], format: "date-time" },
                            created_by: { type: "integer" },
                            updated_by: { type: ["integer", "null"] },
                            customer_name: { type: ["string", "null"] }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getAllSalesReturnSchema;
