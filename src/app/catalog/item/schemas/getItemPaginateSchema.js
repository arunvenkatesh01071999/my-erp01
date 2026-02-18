const { errorSchemas } = require("../../../commons/schemas/errorSchemas");

const getItemPaginateSchema = {
    tags: ["Item"],
    summary: "API to fetch detailed item data with pagination and associated information",
    headers: { $ref: "request-headers#" },
    queryString: {
        type: "object",
        required: ["status", "search"],
        additionalProperties: false,
        properties: {
            status: { type: "integer", enum: [0, 1, 2], default: 0 },
            search: { type: "string", default: "" },
        },
    },
    params: {
        type: "object",
        properties: {
            page_size: { type: "integer" },
            current_page: { type: "integer" }
        },
        required: ["page_size", "current_page"],
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
                            company_name: { type: "string" },
                            outlet_rate: { type: "number" },
                            self_life: { type: "integer" },
                            type_id: { type: "integer" },
                            product_type_name: { type: "string" },
                            available_balance: { type: "number" },
                            main_catgory_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    category_name: { type: "string" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            merchant_category_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    merchant_category_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            sub_category_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    subcategory_name: { type: "string" },
                                    category_id: { type: "integer" },
                                    category_name: { type: "string" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            head_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    cateogory_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            typedesign_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    type_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            main_uom_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    units_short_name: { type: "string" },
                                    units_long_name: { type: "string" },
                                    is_active: { type: "boolean" },
                                    created_at: { type: "string", format: "date-time" },
                                    updated_at: { type: "string", format: "date-time" }
                                },
                            },
                            uom_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    units_short_name: { type: "string" },
                                    units_long_name: { type: "string" },
                                    is_active: { type: "boolean" },
                                    created_at: { type: "string", format: "date-time" },
                                    updated_at: { type: "string", format: "date-time" }
                                },
                            },
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
                            incharge_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    incharge_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    incharge_group_id: { type: "integer" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            tray_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    tray_name: { type: "string" },
                                    tray_weight: { type: "integer" },
                                    company_id: { type: "integer" },
                                    is_active: { type: "boolean" }
                                },
                            },
                            expiry_type_id: { type: "integer" },
                            expiry_value: { type: "integer" },
                            expiry_name: { type: "string" },
                            mbq: { type: "integer" },
                            shrinkage: { type: "integer" },
                            case_qty: { type: "integer" },
                            putaway: { type: "integer" },
                            putaway_name: { type: "string" },
                            bulk_item: { type: "boolean" },
                            returnable_item: { type: "boolean" },
                            purchase: { type: "boolean" },
                            sales_margin_new: { type: "boolean" },
                            min_stock_warning: { type: "boolean" },
                            batch_item: { type: "boolean" },
                            outlet_non_saleable: { type: "boolean" },
                            allow_neg_stk: { type: "boolean" },
                            gst_inclusive: { type: "boolean" },
                            wscale: { type: "boolean" },
                            convertion_factor: { type: "string" },
                            discount: { type: "string" },
                            expiry_date: { type: "string" },
                            main_product_id: { type: "integer" },
                            main_product_qty: { type: "integer" },
                            parent_product_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    pro_code: { type: "string" },
                                    short_name: { type: "string" },
                                    pro_description: { type: "string" },
                                    regional_name: { type: "string" },
                                    pro_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    company_name: { type: "string" },
                                    type_id: { type: "integer" },
                                    product_type_name: { type: "string" },
                                    main_category_id: { type: "integer" },
                                    main_category_name: { type: "string" },
                                    merchant_category_id: { type: "integer" },
                                    merchant_category_name: { type: "string" },
                                    sub_category_id: { type: "integer" },
                                    sub_category_name: { type: "string" },
                                    head_id: { type: "integer" },
                                    head_name: { type: "string" },
                                    typedesign_id: { type: "integer" },
                                    type_name: { type: "string" },
                                    main_uom_id: { type: "integer" },
                                    uom_id: { type: "integer" },
                                    uom_name: { type: "string" },
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
                                    incharge_name: { type: "string" },
                                    tray_id: { type: "integer" },
                                    tray_name: { type: "string" },
                                    expiry_type_id: { type: "integer" },
                                    expiry_value: { type: "integer" },
                                    expiry_name: { type: "string" },
                                    mbq: { type: "integer" },
                                    shrinkage: { type: "integer" },
                                    case_qty: { type: "integer" },
                                    putaway: { type: "integer" },
                                    putaway_name: { type: "string" },
                                    bulk_item: { type: "boolean" },
                                    returnable_item: { type: "boolean" },
                                    purchase: { type: "boolean" },
                                    min_stock_warning: { type: "boolean" },
                                    batch_item: { type: "boolean" },
                                    outlet_purchase: { type: "boolean" },
                                    outlet_non_saleable: { type: "boolean" },
                                    allow_neg_stk: { type: "boolean" },
                                    gst_inclusive: { type: "boolean" },
                                    wscale: { type: "boolean" },
                                    convertion_factor: { type: "string" },
                                    discount: { type: "string" },
                                    expiry_date: { type: "string" },
                                    main_product_id: { type: "integer" },
                                    main_product_qty: { type: "integer" },
                                    is_active: { type: "boolean" },

                                }
                            },
                            product_weight: { type: "number" },
                            pack_product_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    pro_code: { type: "string" },
                                    short_name: { type: "string" },
                                    pro_description: { type: "string" },
                                    regional_name: { type: "string" },
                                    pro_name: { type: "string" },
                                    company_id: { type: "integer" },
                                    company_name: { type: "string" },
                                    type_id: { type: "integer" },
                                    product_type_name: { type: "string" },
                                    main_category_id: { type: "integer" },
                                    main_category_name: { type: "string" },
                                    merchant_category_id: { type: "integer" },
                                    merchant_category_name: { type: "string" },
                                    sub_category_id: { type: "integer" },
                                    sub_category_name: { type: "string" },
                                    head_id: { type: "integer" },
                                    head_name: { type: "string" },
                                    typedesign_id: { type: "integer" },
                                    type_name: { type: "string" },
                                    main_uom_id: { type: "integer" },
                                    uom_id: { type: "integer" },
                                    uom_name: { type: "string" },
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
                                    incharge_name: { type: "string" },
                                    tray_id: { type: "integer" },
                                    tray_name: { type: "string" },
                                    expiry_type_id: { type: "integer" },
                                    expiry_value: { type: "integer" },
                                    expiry_name: { type: "string" },
                                    mbq: { type: "integer" },
                                    shrinkage: { type: "integer" },
                                    case_qty: { type: "integer" },
                                    putaway: { type: "integer" },
                                    putaway_name: { type: "string" },
                                    bulk_item: { type: "boolean" },
                                    returnable_item: { type: "boolean" },
                                    purchase: { type: "boolean" },
                                    min_stock_warning: { type: "boolean" },
                                    batch_item: { type: "boolean" },
                                    outlet_purchase: { type: "boolean" },
                                    outlet_non_saleable: { type: "boolean" },
                                    allow_neg_stk: { type: "boolean" },
                                    gst_inclusive: { type: "boolean" },
                                    wscale: { type: "boolean" },
                                    convertion_factor: { type: "string" },
                                    discount: { type: "string" },
                                    expiry_date: { type: "string" },
                                    main_product_id: { type: "integer" },
                                    main_product_qty: { type: "integer" },
                                    is_active: { type: "boolean" },
                                }
                            },
                            pack_qty: { type: "number" },
                            margin: { type: "number" },
                            wastage: { type: "number" },
                            session_id: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    name: { type: "string" },
                                    com_id: { type: "integer" },
                                    st_time: { type: "string" }
                                }
                            },
                            outlet_purchase: { type: "boolean" },
                            is_active: { type: "boolean" },
                            outlets: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        code: { type: "string" },
                                        short_name: { type: "string" },
                                        fullname: { type: "string" },
                                        add1: { type: "string" },
                                        add2: { type: "string" },
                                        add3: { type: "string" },
                                        add4: { type: "string" },
                                        city: { type: "integer" },
                                        pincode: { type: "string" },
                                        state: { type: "integer" },
                                        country: { type: "integer" },
                                        phone: { type: "string" },
                                        mobile: { type: "string" },
                                        email: { type: "string" },
                                        website: { type: "string" },
                                        gstin: { type: "string" },
                                        fssai: { type: "string" },
                                        outlet_type: { type: "integer" },
                                        bankacno: { type: "string" },
                                        bankname: { type: "string" },
                                        acname: { type: "string" },
                                        ifsccode: { type: "string" },
                                        company_id: { type: "integer" },
                                        is_gst: { type: "boolean" },
                                        franchise_type: { type: "integer" },
                                        balance: { type: "string" },
                                        credit_limit: { type: "string" },
                                        limitation: { type: "string" },
                                        wallet_balance: { type: "string" },
                                        ref_doc_no: { type: "string" },
                                        for_indent: { type: "integer" },
                                        wh_id: { type: "integer" },
                                        outlet_opng_stock: { type: "string" },
                                        outlet_balnc_stock: { type: "string" },
                                        outlet_min_stock: { type: "string" },
                                        outlet_allow_neg_stk: { type: "boolean" },
                                        outlet_wscale: { type: "boolean" }
                                    }
                                }
                            },
                            vendors: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        supplier_name: { type: "string" },
                                        short_name: { type: "string" },
                                        company_id: { type: "integer" },
                                        mobile: { type: "string" },
                                        phone: { type: "string" },
                                        add1: { type: "string" },
                                        add2: { type: "string" },
                                        add3: { type: "string" },
                                        add4: { type: "string" },
                                        city: { type: "integer" },
                                        pincode: { type: "string" },
                                        state: { type: "integer" },
                                        email: { type: "string" },
                                        website: { type: "string" },
                                        op_bal: { type: "string" },
                                        balance: { type: "string" },
                                        custtype: { type: "string" },
                                        bank_ac_no: { type: "string" },
                                        bankname: { type: "string" },
                                        ac_name: { type: "string" },
                                        ifsccode: { type: "string" },
                                        gstin: { type: "string" },
                                        is_active: { type: "boolean" },
                                        country: { type: "integer" },
                                        fssaino: { type: "string" }
                                    }
                                }
                            },
                            warehouse: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        warehouse_name: { type: "string" },
                                        short_name: { type: "string" },
                                        add1: { type: "string" },
                                        add2: { type: "string" },
                                        add3: { type: "string" },
                                        add4: { type: "string" },
                                        city: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        pincode: { type: "string" },
                                        state: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        country: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        phone: { type: "string" },
                                        mobile: { type: "string" },
                                        email: { type: "string" },
                                        company_id: { type: "integer" },
                                        is_active: { type: "boolean" },
                                        limitation: { type: "number" },
                                        gstin: { type: "string" },
                                        fssai: { type: "string" },
                                        bankacno: { type: "string" },
                                        bankname: { type: "string" },
                                        acname: { type: "string" },
                                        ifsccode: { type: "string" },
                                        is_gst: { type: "boolean" },
                                        wallet_balance: { type: "number" },
                                        main_warehouse: { type: "boolean" },
                                        contact_name: { type: "string" },
                                        warehouse_stock: { type: "number" },
                                        warehouse_is_active: { type: "boolean" },
                                    }
                                }
                            },
                            company_details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        code: { type: "string" },
                                        company_short_name: { type: "string" },
                                        company_fullname: { type: "string" },
                                        add1: { type: "string" },
                                        add2: { type: "string" },
                                        add3: { type: "string" },
                                        add4: { type: "string" },
                                        city: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        pincode: { type: "string" },
                                        state: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        country: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                name: { type: "string" }
                                            }
                                        },
                                        phone: { type: "string", pattern: "^[0-9]{10,12}$" },
                                        mobile: { type: "string", pattern: "^[0-9]{10,12}$" },
                                        email: { type: "string", format: "email" },
                                        website: {
                                            type: "string",
                                            pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)*/?$"
                                        },
                                        gstin: { type: "string" },
                                        fssai: { type: "string" },
                                        is_active: { type: "boolean" },
                                        created_at: { type: "string", format: "date-time" },
                                        updated_at: { type: "string", format: "date-time" },
                                        created_by: { type: "integer" },
                                        updated_by: { type: "integer" },
                                        bank_details: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "integer" },
                                                    bankacno: { type: "string" },
                                                    bankname: { type: "string" },
                                                    acname: { type: "string" },
                                                    ifsccode: { type: "string" },
                                                    company_id: { type: "integer" },
                                                    is_active: { type: "boolean" },
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
                            barcode_list: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        prod_id: { type: "integer" },
                                        product_code: { type: "string" },
                                        barcode: { type: "string" },
                                        company_id: { type: "integer" },
                                        is_active: { type: "boolean" }

                                    }
                                }
                            },
                            customers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        name: { type: "string" },
                                        is_active: { type: "boolean" }
                                    },
                                }
                            },
                            pickers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        picker_name: { type: "string" },
                                        password: { type: "string" },
                                        today_work_status: { type: "integer" },
                                        company_id: { type: "integer" },
                                        is_active: { type: "boolean" }
                                    }
                                }
                            }
                        }
                    }
                },
                meta: {
                    type: "object",
                    properties: {
                        pagination: {
                            type: "object",
                            properties: {
                                total: { type: "integer" },
                                page: { type: "integer" },
                                page_size: { type: "string" },
                                total_pages: { type: "integer" }
                            }
                        }
                    }
                }
            },
            ...errorSchemas,
        }
    }
};

module.exports = getItemPaginateSchema;