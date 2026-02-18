const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const putSalesReturnSchema = {
    tags: ["Sales"],
    summary: "Update a sales return entry by ID",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "integer", errorMessage: "id must be an integer" }
        }
    },
    body: {
        type: "object",
        required: ["docdate", "customer_id", "grand_total", "sale_type", "sales_return_details"],
        properties: {
            docdate: {
                type: "string",
                format: "date",
                errorMessage: "docdate must be a valid date"
            },
            company_id: { type: "integer" },
            customer_id: {
                type: "integer",
                errorMessage: "customer_id must be an integer"
            },
            sub_total_amount: { type: "number" },
            discount: { type: "number" },
            grand_total: {
                type: "number",
                errorMessage: "grand_total must be a number"
            },
            invoice_no: { type: "integer" },
            sales_master_id: { type: "integer" },
            round_off: { type: "number" },
            return_type: { type: "integer" },
            app_flag: { type: "integer" },
            cess_amt: { type: "number" },
            sale_type: {
                type: "integer",
                errorMessage: "sale_type must be an integer"
            },
            total_gst_amount: { type: "number" },
            total_igst_amount: { type: "number" },
            total_cess_amount: { type: "number" },
            warehouse_id: { type: "integer" },

            sales_return_details: {
                type: "array",
                items: {
                    type: "object",
                    required: ["product_id", "return_qty", "rate", "amount"],
                    properties: {
                        product_id: { type: "integer" },
                        batch_no: { type: "string" },
                        exp_date: { type: "string", format: "date" },
                        actual_qty: { type: "number" },
                        return_qty: { type: "number" },
                        actual_free_qty: { type: "number" },
                        return_free_qty: { type: "number" },
                        discount: { type: "number" },
                        discount_amount: { type: "number" },
                        mrp: { type: "number" },
                        rate: { type: "number" },
                        amount: { type: "number" },
                        reason: { type: "integer" },
                        gst: { type: "number" },
                        cgst: { type: "number" },
                        sgst: { type: "number" },
                        gst_amount: { type: "number" },
                        igst: { type: "number" },
                        igst_amount: { type: "number" },
                        cess: { type: "number" },
                        cess_amount: { type: "number" },
                        sale_type: { type: "integer" },
                        wh_stock: { type: "number" },
                        dne: { type: "number" }
                    }
                }
            }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
                data: { type: "object" }
            }
        },
        ...errorSchemas
    }
};

module.exports = putSalesReturnSchema;
