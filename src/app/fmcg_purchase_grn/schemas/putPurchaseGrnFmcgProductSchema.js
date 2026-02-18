const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const putPurchaseFMCGGrnProductSchema = {
    tags: ["PURCHASE FMCG GRN PRODUCT SCHEMA"],
    summary: "This API is to post a purchase GRN product schema",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        required: ["grn_id"],
        properties: {
            grn_id: { type: "integer" }
        }
    },
    body: {
        type: "object",
        required: [
            "docdate",
            "pono",
            "podate",
            "supplier_id",
            "wh_id",
            "purchase_grn_details"
        ],
        properties: {
            docdate: { type: "string", format: "date" },
            pono: { type: "string" },
            podate: { type: "string", format: "date" },
            party_invoice_no: { type: "string" },
            party_invoice_date: { type: "string", format: "date" },
            customer_type: { type: "number" },
            supplier_id: { type: "integer" },
            remark: { type: "string" },
            return_amount: { type: "number" },
            retrun_remark: { type: "string" },
            company_id: { type: "integer" },
            total_order_qty: { type: "integer" },
            total_received_qty: { type: "integer" },
            wh_id: { type: "integer" },
            gst: { type: "boolean" },
            igst: { type: "boolean" },
            purchase_grn_details: {
                type: "array",
                items: {
                    type: "object",
                    required: [
                        "product_id",
                        "order_qty",
                        "received_qty",
                        "category_id",
                        "sub_category_id",
                        "head_id",
                        "type_design_id",
                        "uom_id",
                        "barcode",
                        "mrp",
                        "pur_rate",
                        "sale_rate"
                    ],
                    properties: {
                        product_id: { type: "integer" },
                        prod_code: { type: "string" },
                        hsn: { type: "string" },
                        category_id: { type: "integer" },
                        sub_category_id: { type: "integer" },
                        head_id: { type: "integer" },
                        type_design_id: { type: "integer" },
                        uom_id: { type: "integer" },
                        barcode: { type: "string" },
                        order_qty: { type: "integer" },
                        received_qty: { type: "integer" },
                        pur_rate: { type: "number" },
                        sale_rate: { type: "number" },
                        free_qty: { type: "integer" },
                        amount: { type: "string" },
                        mrp: { type: "number" },
                        self_life_qty: { type: "integer" },
                        return_qty: { type: "integer" },
                        tray_id: { type: "integer" },
                        tray_count: { type: "integer" },
                        purchase_batch_details: {
                            type: "array",
                            items: {
                                type: "object",
                                required: [
                                    "batch_no",
                                    "qty",
                                    "manufacture_date",
                                    "expiry_type",
                                    "expiry_value"
                                ],
                                properties: {
                                    batch_no: { type: "string" },
                                    qty: { type: "integer" },
                                    self_life_qty: { type: "string" },
                                    return_qty: { type: "integer" },
                                    manufacture_date: { type: "string", format: "date" },
                                    expiry_type: { type: "integer" },
                                    expiry_value: { type: "integer" }
                                }
                            }
                        }
                    }
                }
            },
            tray_details: {
                type: "array",
                items: {
                    type: "object",
                    required: [
                        "tray_id",
                        "tray_qty"
                    ],
                    properties: {
                        tray_id: { type: "integer" },
                        tray_qty: { type: "integer" }
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
                docno: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = putPurchaseFMCGGrnProductSchema;
