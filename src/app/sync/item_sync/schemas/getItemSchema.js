const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemSchema = {
    tags: ["ITEMS"],
    summary: "This API fetches item details",
    headers: { $ref: "request-headers#" },
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    pro_code: { type: "string" },
                    pro_name: { type: "string" },
                    short_name: { type: "string" },
                    pro_description: { type: "string" },
                    type: { type: "integer" },
                    sub_cat: { type: "integer" },
                    company_id: { type: "integer" },
                    uom: { type: "integer" },
                    barcode: { type: ["string", "null"] },
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
                    allow_neg_stk: { type: "boolean" },
                    wscale: { type: "boolean" },
                    vendor: { type: ["string", "null"] },
                    is_active: { type: "boolean" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                    created_by: { type: "integer" },
                    updated_by: { type: "integer" },
                    cat_id: { type: "integer" },
                    head_id: { type: "integer" },
                    discount: { type: "number" },
                    manufacturing_date: { type: "string", format: "date-time" },
                    expiry_date: { type: "string", format: "date-time" },
                    product_type: { type: "string" },
                    main_product_id: { type: ["integer", "null"] },
                    main_uom_id: { type: "integer" },
                    convertion_factor: { type: "number" },
                    main_product_qty: { type: "integer" },
                    is_inserted: { type: "boolean" },
                    uom_name: { type: "string" },
                    head_name: { type: "string" },
                    type_name: { type: "string" },
                    cat_name: { type: "string" },
                    sub_cat_name: { type: "string" },

                    outlets: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                outlet_id: { type: "integer" },
                                opng_stock: { type: "number" },
                                balnc_stock: { type: "number" },
                                company_id: { type: "integer" },
                                min_stock: { type: "number" },
                                allow_neg_stk: { type: "boolean" },
                                wscale: { type: "boolean" },
                                min_warn_stock: { type: "boolean" }
                            }
                        }
                    },

                    vendors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                vendors_id: { type: "integer" }
                            }
                        }
                    },
                    barcode_list: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                pro_id: { type: "integer" },
                                barcode: { type: "string" },
                                product_code: { type: "string" },
                                outlet_id: { type: "integer" },
                                created_at: { type: "string", format: "date-time" },
                                updated_at: { type: "string", format: "date-time" },
                                created_by: { type: "integer" },
                                updated_by: { type: "integer" }
                            }
                        }
                    }
                }
            }
        },
        ...errorSchemas
    }
};

module.exports = getItemSchema;
