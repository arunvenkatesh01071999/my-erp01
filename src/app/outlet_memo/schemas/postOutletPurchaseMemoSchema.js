const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postOutletPurchaseMemoSchema = {
    tags: ["POST OUTLET PURCHASE MEMO SCHEMA"],
    summary: "This API is to post a outlet purchase memo schema",
    headers: { $ref: "request-headers#" },

    body: {
        type: "object",
        required: [
            "supplier_id",
            "outlet_id",
            "party_invoice_no",
            "party_invoice_date",
            "invoice_amount",
            "image_url",
            "pono",
            "podate",
            "total_order_qty",
            "total_received_qty",
            "purchase_memo_details",
        ],
        properties: {
            company_id: { type: "integer" },
            supplier_id: { type: "integer" },
            outlet_id: { type: "integer" },
            party_invoice_no: { type: "string" },
            party_invoice_date: { type: "string" },
            pono: { type: "string" },
            podate: { type: "string" },
            total_order_qty: { type: "integer" },
            invoice_amount: { type: "number" },
            total_received_qty: { type: "integer" },
            image_url: { type: "string" },
            purchase_memo_details: {
                type: "array",
                items: {
                    type: "object",
                    required: [
                        "product_id",
                        "prod_code",
                        "order_qty",
                        "received_qty",
                        "return_qty",
                        "memo_mrp",
                        "po_mrp",
                        "memo_batch_details",
                        "free_qty"
                    ],
                    properties: {
                        product_id: { type: "integer" },
                        prod_code: { type: "string" },
                        order_qty: { type: "integer" },
                        received_qty: { type: "integer" },
                        return_qty: { type: "integer" },
                        memo_mrp: { type: "number" },
                        po_mrp: { type: "number" },
                        free_qty: { type: "number" },
                        memo_batch_details: {
                            type: "array",
                            items: {
                                type: "object",
                                required: [
                                    "batch_no",
                                    "qty",
                                    "mrp",
                                    "expiry_type",
                                    "expiry_value",
                                    "manufacture_date",
                                    "expiry_date",
                                ],
                                properties: {
                                    batch_no: { type: "string" },
                                    qty: { type: "integer" },
                                    mrp: { type: "number" },
                                    expiry_type: { type: "integer" },
                                    expiry_value: { type: "integer" },
                                    manufacture_date: { type: "string" },
                                    expiry_date: { type: "string" },
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
                success: { type: "boolean" },
                message: { type: "string" },
                docno: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postOutletPurchaseMemoSchema;
