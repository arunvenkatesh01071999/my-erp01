const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const postIndentOrderSchema = {
    tags: ["IndentOrder"],
    summary: "This API is to post a Indent Order",
    headers: { $ref: "request-headers#" },
    body: {
        type: "object",
        required: ["indent_date", "wh_id", "total_items", "total_order_qty", "total_amt", "total_gst", "indent_order_details"],
        properties: {
            indent_date: { type: "string" },
            wh_id: { type: "integer" },
            total_items: { type: "integer" },
            total_order_qty: { type: "integer" },
            total_amt: { type: "number" },
            total_gst: { type: "number" },
            manual_flag: { type: "boolean" },
            outlet_id: { type: "integer" },
            indent_order_details: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        indent_date: { type: "string" },
                        prod_id: { type: "integer" },
                        order_qty: { type: "integer" },
                        cat_id: { type: "integer" },
                        sub_cat_id: { type: "integer" },
                        head_id: { type: "integer" },
                        type_design_id: { type: "integer" },
                        uom_id: { type: "integer" },
                        // barcode: { type: "string" },
                        mrp: { type: "number" },
                        gst: { type: "number" }
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
                indent_no: { type: "string" }
            }
        },
        ...errorSchemas
    }
};

module.exports = postIndentOrderSchema;
