const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postStoresPOSchema = {
    tags: ["Purchase Order"],
    summary: "This API is to post a Purchase Order",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: [
            "podate",
            "supplier_id",
            "expiry_date",
            "total_items",
            "total_order_qty",
            "sub_total_amt",
            "total_gst_amt",
            "total_cess_amt",
            "roff",
            "grand_total_amt",
            "purchase_order_details",
            "outlet_id"
        ],
        properties: {
            podate: { type: "string", format: "date", errorMessage: "podate must be a valid date in YYYY-MM-DD format" },
            supplier_id: { type: "integer", errorMessage: "supplier_id must be an integer" },
            expiry_date: { type: "string", format: "date", errorMessage: "expiry_date must be a valid date in YYYY-MM-DD format" },
            total_items: { type: "integer", errorMessage: "total_items must be an integer" },
            total_order_qty: { type: "integer", errorMessage: "total_order_qty must be an integer" },
            sub_total_amt: { type: "number", errorMessage: "sub_total_amt must be a number" },
            total_gst_amt: { type: "number", errorMessage: "total_gst_amt must be a number" },
            total_cess_amt: { type: "number", errorMessage: "total_cess_amt must be a number" },
            roff: { type: "number", errorMessage: "roff must be a number" },
            grand_total_amt: { type: "number", errorMessage: "grand_total_amt must be a number" },
            po_ref_no: { type: "string", errorMessage: "po_ref_no must be a string" },
            purchase_order_type: { type: "integer" }, // 1- KPN, 2 - SAVO MART
            outlet_id: { type: "integer", errorMessage: "outlet_id must be an integer" },
            purchase_order_details: {
                type: "array",
                minItems: 1,
                errorMessage: "purchase_order_details must be a non-empty array",
                items: {
                    type: "object",
                    required: [
                        "product_id",
                        "prod_code",
                        "category_id",
                        "sub_category_id",
                        "head_id",
                        "type_design_id",
                        "uom_id",
                        "barcode",
                        "balance",
                        "mrp",
                        "pur_rate",
                        "gst",
                        "gst_amount",
                        "qty",
                        "loose_qty",
                        "received_qty",
                        "amount",
                        "cgst",
                        "sgst",
                        "cess",
                        "cess_amount",
                        "case_qty"
                    ],
                    properties: {   
                        product_id: { type: "integer", errorMessage: "product_id must be an integer" },
                        prod_code: { type: "string", errorMessage: "prod_code must be an string" },
                        category_id: { type: "integer", errorMessage: "category_id must be an integer" },
                        sub_category_id: { type: "integer", errorMessage: "sub_category_id must be an integer" },
                        head_id: { type: "integer", errorMessage: "head_id must be an integer" },
                        type_design_id: { type: "integer", errorMessage: "type_design_id must be an integer" },
                        uom_id: { type: "integer", errorMessage: "uom_id must be an integer" },
                        barcode: { type: "string", errorMessage: "barcode must be a string" },
                        balance: { type: "number", errorMessage: "balance must be an number" },
                        mrp: { type: "number", errorMessage: "mrp must be a number" },
                        pur_rate: { type: "number", errorMessage: "pur_rate must be a number" },
                        gst: { type: "number", errorMessage: "gst must be a number" },
                        gst_amount: { type: "number", errorMessage: "gst_amount must be a number" },
                        qty: { type: "integer", errorMessage: "qty must be an integer" },
                        loose_qty: { type: "integer", errorMessage: "loose qty must be an integer" },
                        received_qty: { type: "integer", errorMessage: "received_qty must be an integer" },
                        amount: { type: "number", errorMessage: "amount must be a number" },
                        cgst: { type: "number", errorMessage: "cgst must be a number" },
                        sgst: { type: "number", errorMessage: "sgst must be a number" },
                        cess: { type: "number", errorMessage: "cess must be a number" },
                        cess_amount: { type: "number", errorMessage: "cess_amount must be a number" },
                        case_qty: { type: "integer", errorMessage: "case_qty must be an integer" }
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
                purchase_order_id: { type: "integer" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postStoresPOSchema;
