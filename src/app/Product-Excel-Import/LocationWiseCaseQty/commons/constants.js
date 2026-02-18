const LOCATION_CASE_QTY = {
    NAME: "location_case_qty",
    COLUMNS: {
        ID: "id",
        LOCATION_ID: "location_id",
        PRODUCT_CODE: "product_code",
        CASE_QTY: "case_qty",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const XL_IMPORT_LOG = {
    NAME: "xl_import_log",
    COLUMNS: {
        ID: "id",
        XL_NAME: "xl_name",
        XL_DETAIL: "xl_detail",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


const OUTLET_PRODUCT_MAPPING = {
    NAME: "outlet_products_mapping",
    COLUMNS: {
        ID: "id",
        PRODUCT_ID: "pro_id",
        PRODUCT_CODE: "pro_code",
        OUTLET_ID: "outlet_id",
        OPENING_STOCK: "opng_stock",
        BALENCE_STOCK: "balnc_stock",
        MIN_STOCK: "min_stock",
        ALLOW_NEG_STK: "allow_neg_stk",
        WSCALE: "wscale",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        MIN_WARN_STOCK: "min_warn_stock"
    }
};

module.exports = {
    LOCATION_CASE_QTY,
    OUTLET_PRODUCT_MAPPING,
    XL_IMPORT_LOG
}
