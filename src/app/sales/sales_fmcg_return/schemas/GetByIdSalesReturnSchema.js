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
                docdate: { type: "string", format: "date-time" },
                company_id: { type: "integer" },
                customer_id: { type: "integer" },
                sub_total_amount: { type: "number" },
                discount: { type: "number" },
                remark: { type: "string" },
                grand_total: { type: "string" },
                invoice_no: { type: "string" },
                sales_master_id: { type: "integer" },
                round_off: { type: "number" },
                return_type: { type: "integer" },
                app_flag: { type: "integer" },
                total_cess_amount: { type: "number" },
                total_gst_amount: { type: "number" },
                total_igst_amount: { type: "number" },
                customer_name: { type: "string" },
                customer_address_one: { type: "string" },
                customer_address_two: { type: "string" },
                gst_type: { type: "integer" },
                customer_type: { type: "integer" },
                sales_return_details: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            product_id: { type: "integer" },
                            batch_no: { type: "string" },
                            exp_date: { type: "string", format: "date" },
                            actual_qty: { type: "number" },
                            return_qty: { type: "number" },
                            actual_free: { type: "number" },
                            return_free_qty: { type: "number" },
                            discount: { type: "number" },
                            discount_amount: { type: "number" },
                            rate: { type: "number" },
                            amount: { type: "number" },
                            cgst: { type: "number" },
                            sgst: { type: "number" },
                            gst: { type: "number" },
                            cess: { type: "number" },
                            cess_amount: { type: "number" },
                            sale_type: { type: "integer" },
                            mrp: { type: "number" },
                            wh_stock: { type: "number" },
                            dne: { type: "number" },
                            product_name: { type: "string" },
                            unit_name: { type: "string" },
                            reason: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    reason_name: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getSalesReturnByIdSchema;
