const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postOutletBasedManualPurchaseSchema = {
    tags: ["PURCHASE FMCG SCHEMA"],
    summary: "This API is to post outlet purchase",
    headers: { $ref: "request-headers#" },

    body: {
        type: "object",
        required: [
            "supplier_id",
            "company_id",
            "outlet_id",
            "wh_id",
            "invoice_no",
            "invoice_date",
            "pono",
            "podate",
            // "memo_no",
            // "memo_date",
            "total_items",
            "purchase",
            "outlet_purchase_details"
        ],

        properties: {
            supplier_id: { type: "integer" },
            company_id: { type: "integer" },
            outlet_id: { type: "integer" },
            wh_id: { type: "integer" },

            invoice_no: { type: "string" },
            invoice_date: { type: "string", format: "date" },

            pono: { type: "string" },
            podate: { type: "string", format: "date" },

            // memo_no: { type: "string" },
            // memo_date: { type: "string", format: "date" },

            total_items: { type: "integer" },
            purchase: { type: "boolean" },
            purchase_return: { type: "boolean" },
            
            is_debit_note: { type: "boolean" },
            total_debit_note_amount: { type: "number" },
        
            outlet_purchase_details: {
                type: "array",
                minItems: 1,
                items: {
                    type: "object",
                    required: ["product_id", "product_code", "qty", "mrp"],

                    properties: {
                        product_id: { type: "integer" },
                        product_code: { type: "string" },

                        qty: { type: "number" },
                        return_qty: { type: "number" },
                        free_qty: { type: "number" },

                        mrp: { type: "number" },
                        purchase_rate: { type: "number" },
                        gst: { type: "number" },
                        cess: { type: "number" },
                        hsn: { type: "string" },
                        sale_rate: { type: "number" },
                        accepted_margin: { type: "number" },
                        self_life_qty: { type: "number" },

                        outlet_purchase_batch_details: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                required: ["batch_no", "qty", "mrp"],

                                properties: {
                                    batch_no: { type: "string" },
                                    qty: { type: "number" },
                                    mrp: { type: "number" },
                                    self_life_qty: { type: "number" },
                                    return_qty: { type: "number" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postOutletBasedManualPurchaseSchema;
