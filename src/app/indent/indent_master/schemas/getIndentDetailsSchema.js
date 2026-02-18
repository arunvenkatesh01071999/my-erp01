const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentDetailsSchema = {
    tags: ["Indent"],
    summary: "API to list indent orders with details",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            indent_no: { type: "string" }
        },
    },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    indent_no: { type: "string" },
                    indent_date: { type: "string", format: "date" },
                    supplier_id: { type: ["integer", "null"] },
                    total_items: { type: "string" }, // Updated from number to string
                    total_order_qty: { type: "string" },
                    total_amt: { type: "string" },
                    total_gst: { type: "string" },
                    is_approved: { type: "boolean" },
                    is_approved_by: { type: ["integer", "null"] },
                    created_by: { type: "integer" },
                    updated_by: { type: ["integer", "null"] },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                    wh_id: { type: "integer" },
                    outlet_id: { type: "integer" },
                    is_transfer: { type: "boolean" },
                    manual_flag: { type: "boolean" },
                    auto_flag: { type: "boolean" },
                    warehouse_id: { type: "integer" },
                    warehouse_name: { type: "string" },
                    warehouse_short_name: { type: "string" },
                    company_id: { type: "integer" },
                    indent_details_lines: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                indent_mst_id: { type: "integer" },
                                indent_no: { type: "string" },
                                indent_date: { type: "string", format: "date" },
                                prod_id: { type: "integer" },
                                mrp: { type: "integer" }, // Updated from number to string
                                gst: { type: "integer" },
                                order_qty: { type: "integer" },
                                total_qty: { type: ["string", "null"] },
                                cat_id: { type: "integer" },
                                sub_cat_id: { type: "integer" },
                                head_id: { type: "integer" },
                                type_design_id: { type: "integer" },
                                uom_id: { type: "integer" },
                                units_short_name: { type: "string" },
                                created_by: { type: "integer" },
                                updated_by: { type: ["integer", "null"] },
                                created_at: { type: "string", format: "date-time" },
                                updated_at: { type: "string", format: "date-time" },
                                pro_name: { type: ["string", "null"] },
                                short_name: { type: ["string", "null"] },
                                pro_code: { type: ["string", "null"] },
                                pur_rate: { type: "integer" },
                                sale_rate: { type: "integer" },
                                wholesale_rate: { type: "integer" },
                                cess: { type: "integer" },
                                hsn: { type: "integer" },
                                type: { type: "integer" },
                                discount: { type: "number" },
                                qty: { type: "number" }
                            }
                        },
                    },
                },
            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentDetailsSchema;
