const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemOutletSchema = {
    tags: ["Item"],
    summary: "This API is to get Item",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            head: { type: "integer" },
            type: { type: "integer" },
            category: { type: "integer" },
            subcategory: { type: "integer" },
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            pro_code: { type: "string" },
                            pro_name: { type: "string" },
                            type: { type: "integer" },
                            type_name: { type: "string" },
                            sub_cat: { type: "integer" },
                            sub_cat_name: { type: "string" },
                            uom: { type: "integer" },
                            uom_name: { type: "string" },
                            head_id: { type: "integer" },
                            head_name: { type: "string" },
                            cat_id: { type: "integer" },
                            cat_name: { type: "string" },
                            barcode: { type: "string" },
                            pur_rate: { type: "number" },
                            sale_rate: { type: "number" },
                            wholesale_rate: { type: "number" },
                            mrp: { type: "number" },
                            gst: { type: "number" },
                            cess: { type: "number" },
                            hsn: { type: "string" },
                            op_stk: { type: "number" },
                            balance: { type: "number" },
                            min_stock: { type: "number" },
                            allow_neg_stock: { type: "boolean" },
                            wscale: { type: "boolean" },
                            vendor: { type: "integer" },
                            company_id: { type: "integer" },
                            is_active: { type: "boolean" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getItemOutletSchema;
