const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesReturnByIdSchema = {
    tags: ["Sales Return"],
    summary: "Get a Sales Return record by ID",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "integer" }
        }
    },

    response: {
        200: {
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
                customer_name: { type: ["string", "null"] },

                details: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            sales_return_id: { type: "integer" },
                            financial_year: { type: "string" },
                            product_id: { type: "integer" },
                            batch_no: { type: "string" },
                            exp_date: { type: "string", format: "date" },
                            act_qty: { type: "string" },
                            qty: { type: "string" },
                            act_free: { type: "string" },
                            free: { type: "string" },
                            discount: { type: "string" },
                            discount_amount: { type: "string" },
                            vat: { type: "string" },
                            vat_amount: { type: "string" },
                            rate: { type: "string" },
                            amount: { type: "string" },
                            supplier_id: { type: "integer" },
                            reason: { type: "string" },
                            cgst: { type: "string" },
                            sgst: { type: "string" },
                            cess: { type: "string" },
                            cess_amt: { type: "string" },
                            sale_type: { type: "integer" },
                            mrp: { type: "string" },
                            wh_stock: { type: "string" },
                            dne: { type: "string" },
                            company_id: { type: "integer" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: ["string", "null"], format: "date-time" },
                            created_by: { type: "integer" },
                            updated_by: { type: ["integer", "null"] },
                            product_name: { type: "string" }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSalesReturnByIdSchema;
