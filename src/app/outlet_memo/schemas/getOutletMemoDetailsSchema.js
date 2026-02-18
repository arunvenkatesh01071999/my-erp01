const { errorSchemas } = require("../../commons/schemas/errorSchemas");
const { params } = require("./getOutletMemoSupplierListSchema");

const getOutletMemoDetailsSchema = {
    tags: ["OUTLET MEMO DETAILS"],
    summary: "API to list GRN PO items with batch details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            memo_no: { type: "string" },
            outlet_id: { type: "integer" },
        },
        required: ["memo_no", "outlet_id"]
    },


    response: {
        200: {
            type: "object",
            required: [
                "memo_no",
                "grand_total_amt",
                "sub_total_amt",
                "invoice_no",
                "invoice_date",
                "total_order_qty",
                "total_received_qty",
                "remark",
                "return_amount",
                "return_remark",
                "discount",
                "roff",
                "other_charges",
                "total_gst_amt",
                "total_igst_amt",
                "total_cess_amt",
                "advance",
                "tcs",
                "invoice_amount",
                "image_url",
                "outlet_name",
                "supplier_name",
                "user_name",
                "memo_item_details"
            ],
            properties: {
                memo_no: { type: "string" },
                grand_total_amt: { type: "number" },
                sub_total_amt: { type: "number" },
                invoice_no: { type: "string" },
                invoice_date: { type: "string", format: "date" },
                total_order_qty: { type: "number" },
                total_received_qty: { type: "number" },
                remark: { type: "string" },
                return_amount: { type: "number" },
                return_remark: { type: "string" },
                discount: { type: "number" },
                roff: { type: "number" },
                other_charges: { type: "number" },
                total_gst_amt: { type: "number" },
                total_igst_amt: { type: "number" },
                total_cess_amt: { type: "number" },
                advance: { type: "string" },
                tcs: { type: "string" },
                invoice_amount: { type: "number" },
                image_url: { type: "string" },
                outlet_name: { type: "string" },
                supplier_name: { type: "string" },
                user_name: { type: "string" },
                memo_item_details: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [
                            "product_id",
                            "product_code",
                            "barcode",
                            "hsn_code",
                            "discount",
                            "discount_amount",
                            "purchase_rate",
                            "amount",
                            "accepted_margin",
                            "sale_rate",
                            "gst",
                            "gst_amount",
                            "igst",
                            "igst_amount",
                            "cgst",
                            "sgst",
                            "cess",
                            "cess_amount",
                            "po_qty",
                            "memo_qty",
                            "po_mrp",
                            "memo_mrp",
                            "uom_id",
                            "units_short_name",
                            "product_name",
                            "memo_item_batch_details"
                        ],
                        properties: {
                            product_id: { type: "number" },
                            product_code: { type: "string" },
                            barcode: { type: "string" },
                            hsn_code: { type: "string" },
                            discount: { type: "number" },
                            discount_amount: { type: "number" },
                            purchase_rate: { type: "number" },
                            amount: { type: "number" },
                            accepted_margin: { type: "number" },
                            sale_rate: { type: "number" },
                            gst: { type: "number" },
                            gst_amount: { type: "number" },
                            igst: { type: "number" },
                            igst_amount: { type: "number" },
                            cgst: { type: "number" },
                            sgst: { type: "number" },
                            cess: { type: "number" },
                            cess_amount: { type: "number" },
                            po_qty: { type: "number" },
                            memo_qty: { type: "number" },
                            po_mrp: { type: "number" },
                            memo_mrp: { type: "number" },
                            mrp: { type: "number" },
                            uom_id: { type: "number" },
                            units_short_name: { type: "string" },
                            product_name: { type: "string" },
                            memo_item_batch_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    required: [
                                        "batch_no",
                                        "mrp",
                                        "qty",
                                        "expiry_date",
                                        "manufacture_date"
                                    ],
                                    properties: {
                                        batch_no: { type: "string" },
                                        mrp: { type: "number" },
                                        qty: { type: "number" },
                                        expiry_date: { type: "string", format: "date" },
                                        manufacture_date: { type: "string", format: "date" }
                                    }
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

module.exports = getOutletMemoDetailsSchema;
