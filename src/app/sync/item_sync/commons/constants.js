const ITEM = {
    NAME: "item",
    COLUMNS: {
        ID: "id",
        PRODUCT_CODE: "pro_code",
        PRODUCT_NAME: "pro_name",
        SHORT_NAME: "short_name",
        PRO_DESCRIPTION: "pro_description",
        MANUFACTURING_DATE: "manufacturing_date",
        EXPIRY_DATE: "expiry_date",
        TYPE: "type",
        SUB_CATEGORY: "sub_cat",
        UOM: "uom",
        BARCODE: "barcode",
        PARCHASE_RATE: "pur_rate",
        SALE_RATE: "sale_rate",
        WHOLESALE_RATE: "wholesale_rate",
        MRP: "mrp",
        GST: "gst",
        CESS: "cess",
        HSN: "hsn",
        OP_STK: "op_stk",
        BALANCE: "balance",
        MIN_STOCK: "min_stock",
        ALLOW_NEG_STK: "allow_neg_stk",
        WSCALE: "wscale",
        VENDOR: "vendor",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        HEADID: "head_id",
        CATID: "cat_id",
        PRODUCT_TYPE: "product_type",
        MAIN_PRODUCT_ID: "main_product_id",
        MAIN_PRODUCT_QTY: "main_product_qty",
        MAIN_UOM_ID: "main_uom_id",
        CONVERTION_FACTOR: "convertion_factor",
        DISCOUNT: "discount"

    }
};

const UNITS = {
    NAME: "units",
    COLUMNS: {
        ID: "id",
        UNITS_SHORT_NAME: "units_short_name",
        UNITS_LONG_NAME: "units_long_name",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
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

const BARCODE_LIST = {
    NAME: "barcode_list",
    COLUMNS: {
        ID: "id",
        PROD_ID: "prod_id",
        BARCODE: "barcode",
        IS_SOLD: "is_sold",
        PRODUCT_CODE: "product_code",
        IS_ACTIVE: "is_active",
        COMPANY_ID: "company_id",
        OUTLET_ID: "outlet_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        PURCHASE_NO: "purchase_no",
        IS_VERIFIED: "is_verified"
    }
};

const VENDORS_MAPPING = {
    NAME: "vendors_mapping",
    COLUMNS: {
        ID: "id",
        VENDORS_ID: "vendors_id",
        PRODUCT_ID: "pro_id",
        PRODUCT_CODE: "pro_code",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const HEADS = {
    NAME: "heads",
    COLUMNS: {
        ID: "id",
        CATEOGORY_NAME: "cateogory_name",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const TYPEDESIGN = {
    NAME: "typedesign",
    COLUMNS: {
        ID: "id",
        TYPE_NAME: "type_name",
        TYPE_ID: "type_id",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const MAIN_CATEGORY = {
    NAME: "main_category",
    COLUMNS: {
        ID: "id",
        CATEGORY_NAME: "category_name",
        CATEGORY_IMAGE: "category_image",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        IS_ACTIVE: "is_active"
    }
};

const SUB_CATEGORY = {
    NAME: "sub_category",
    COLUMNS: {
        ID: "id",
        SUBCATEGORY_NAME: "subcategory_name",
        CATEGORY_ID: "category_id",
        SUBCATEGORY_IMAGE: "subcategory_image",
        COMPANY_ID: "company_id",
        IS_INSERTED: "is_inserted",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        IS_ACTIVE: "is_active"
    }
};



module.exports = {
    ITEM,
    VENDORS_MAPPING,
    UNITS,
    OUTLET_PRODUCT_MAPPING,
    BARCODE_LIST,
    HEADS,
    TYPEDESIGN,
    SUB_CATEGORY,
    MAIN_CATEGORY
};
