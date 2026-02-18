const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getBarcodeListSchema = {
    tags: ["Barcode List"],
    summary: "This API is to get Barcode Lists",
    headers: { $ref: "request-headers#" },
    params: {
        type: "object",
        properties: {
            company_id: { type: "integer" },
            page_size: { type: "integer" },
            current_page: { type: "integer" },
            outlet_id: { type: "integer" },
            g_v_status: { type: "integer" }, // 0 all 1 generated 2 verified
            s_us_status: { type: "integer" },// 0 all 1 unsold 2 sold
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
                            title: { type: "string" },
                            sub_title: { type: "string" },
                            mrp: { type: "string" },
                            item_name: { type: "string" },
                            barcode: { type: "string" },
                            is_active: { type: "boolean" },
                            is_sold: { type: "boolean" },
                            is_verified: { type: "integer" },
                            code: { type: "string" },
                            fullname: { type: "string" },
                            short_name: { type: "string" },
                            main_category_name: { type: "string" },
                            sub_category_name: { type: "string" },
                            special_discount: { type: "number" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getBarcodeListSchema;
