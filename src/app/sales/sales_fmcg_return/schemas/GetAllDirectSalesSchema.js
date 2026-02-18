const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getDirectSalesProductSchema = {
    tags: ["Direct Sales"],
    summary: "Get Direct Sales Product info by customer and product filters",
    headers: { $ref: "request-headers#" },

    params: {
        type: "object",
        required: ["customer_id"],
        properties: {
            customer_id: { type: "integer" }
        }
    },

    querystring: {
        type: "object",
        properties: {
            sales_type: { type: "integer" },
            search: { type: "string" },
            product_id: { type: "integer" }
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
                            short_name: { type: "string" },
                            pro_description: { type: "string" },
                            regional_name: { type: "string" },
                            pro_name: { type: "string" },
                            company_id: { type: "integer" },
                            type_id: { type: "integer" },
                            main_catgory_id: { type: "integer" },
                            sub_category_id: { type: "integer" },
                            head_id: { type: "integer" },
                            typedesign_id: { type: "integer" },
                            main_uom_id: { type: "integer" },
                            uom_id: { type: "integer" },
                            mrp: { type: "string" },
                            pur_rate: { type: "string" },
                            sale_rate: { type: "string" },
                            wholesale_rate: { type: "string" },
                            gst: { type: "string" },
                            cess: { type: "string" },
                            hsn: { type: "string" },
                            op_stk: { type: "string" },
                            min_stock: { type: "string" },
                            balance: { type: "string" },
                            incharge_id: { type: "integer" },
                            tray_id: { type: "integer" },
                            expiry_type_id: { type: "integer" },
                            expiry_value: { type: "integer" },
                            mbq: { type: "integer" },
                            shrinkage: { type: "integer" },
                            case_qty: { type: "integer" },
                            putaway: { type: "integer" },
                            bulk_item: { type: "boolean" },
                            returnable_item: { type: "boolean" },
                            purchase: { type: "boolean" },
                            min_stock_warning: { type: "boolean" },
                            batch_item: { type: "boolean" },
                            allow_neg_stk: { type: "boolean" },
                            gst_inclusive: { type: "boolean" },
                            wscale: { type: "boolean" },
                            convertion_factor: { type: "string" },
                            discount: { type: "string" },
                            main_product_id: { type: "integer" },
                            main_product_qty: { type: "integer" },
                            is_active: { type: "boolean" },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: "string", format: "date-time" },
                            created_by: { type: "integer" },
                            updated_by: { type: "integer" },
                            is_inserted: { type: "boolean" },
                            merchant_category_id: { type: "integer" },
                            margin: { type: "string" },
                            outlet_rate: { type: "string" },
                            self_life: { type: "integer" },
                            sales_margin: { type: "string" },
                            warehouse_margin: { type: "string" },
                            order_qty: { type: "integer" },
                            parent_product_id: { type: "integer" },
                            product_weight: { type: "integer" },
                            pack_product_id: { type: "integer" },
                            pack_qty: { type: "integer" },
                            uom_name: { type: "string" },
                            customer_id: { type: "string" },
                            customer_name: { type: "string" },
                            customer_type: { type: "integer" }
                        }
                    }
                },
                meta: { $ref: "response-meta#" }
            }
        },
        ...errorSchemas
    }
};

module.exports = getDirectSalesProductSchema;
