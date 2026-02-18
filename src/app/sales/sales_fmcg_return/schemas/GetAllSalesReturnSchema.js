const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getSalesReturnListSchema = {
    tags: ["SALES RETURN"],
    summary: "Get sales return list with customer and invoice details",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    financial_year: { type: "string" },
                    docno: { type: "integer" },
                    docdate: { type: "string", format: "date-time" },
                    customer_type: { type: "integer" },
                    customer_id: { type: "integer" },
                    sub_total_amount: { type: "string" },
                    discount: { type: "string" },
                    total_gst_amount: { type: "string" },
                    total_igst_amount: { type: "string" },
                    total_cess_amount: { type: "string" },
                    grand_total: { type: "string" },
                    temp_grand_total: { type: "string" },
                    invoice_no: { type: "string" },
                    sales_master_id: { type: "integer" },
                    round_off: { type: "string" },
                    sales_return_type: { type: "integer" },
                    app_flag: { type: "integer" },
                    sale_type: { type: "integer" },
                    return_type: { type: "integer" },
                    remark: { type: "string" },
                    sales_verify_id: { type: ["integer", "null"] },
                    einvoice: { type: "integer" },
                    akno: { type: "string" },
                    ak_date: { type: "string", format: "date-time" },
                    irnno: { type: "string" },
                    company_id: { type: "integer" },
                    warehouse_id: { type: "integer" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: ["string", "null"], format: "date-time" },
                    created_by: { type: "integer" },
                    updated_by: { type: ["integer", "null"] },
                    customer_name: { type: "string" },
                    customer_address_one: { type: "string" },
                    customer_address_two: { type: "string" },
                    gst_type: { type: "integer" }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSalesReturnListSchema;
