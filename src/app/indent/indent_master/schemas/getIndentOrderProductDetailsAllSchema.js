const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getIndentOrderProductDetailsAllSchema = {
    tags: ["Indent"],
    summary: "API to list indent orders with details",
    headers: { $ref: "request-headers#" },
    // params: {
    //     type: "object",
    //     properties: {
    //         indent_no: { type: "string" }
    //     },
    //     required: ["indent_no"],
    // },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    indent_no: { type: "string" },
                    indent_date: { type: "string", format: "date" },
                    // wh_id: { type: ["integer", "null"] },
                    total_items: { type: "number" },
                    total_order_qty: { type: "number" },
                    total_amt: { type: "number" },
                    total_gst: { type: "number" },
                    is_approved: { type: "boolean" },
                    is_approved_by: { type: ["integer", "null"] },
                    // created_by: { type: "integer" },
                    // updated_by: { type: ["integer", "null"] },
                    // created_at: { type: "string", format: "date-time" },
                    // updated_at: { type: ["string", "null"], format: "date-time" },
                    warehouse_id: { type: "integer" },
                    warehouse_name: { type: "string" },
                    warehouse_short_name: { type: "string" },
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
                                prod_code: { type: ["string", "null"] },
                                mrp: { type: "number" },
                                gst: { type: "number" },
                                order_qty: { type: "number" },
                                total_qty: { type: ["number", "null"] },
                                cat_id: { type: "integer" },
                                sub_cat_id: { type: "integer" },
                                head_id: { type: "integer" },
                                type_design_id: { type: "integer" },
                                uom_id: { type: "integer" },
                                pro_name: { type: ["string", "null"] },
                                short_name: { type: ["string", "null"] },
                                pro_code: { type: ["string", "null"] },
                            }
                        },
                    },
                },

            },
        },
        ...errorSchemas,
    },
};

module.exports = getIndentOrderProductDetailsAllSchema;
