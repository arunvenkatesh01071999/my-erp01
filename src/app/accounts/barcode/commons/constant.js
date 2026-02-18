const BARCODE_CONFIG = {
    NAME: "barcode_config",
    COLUMNS: {
        ID: "id",
        IS_INDIVIDUAL: "is_individual",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const BARCODE_LIST = {
    NAME: "barcode_list",
    COLUMNS: {
        ID: "id",
        PROD_ID: "prod_id",
        BARCODE: "barcode",
        OUTLET_PRODUCT_ID: "outlet_product_id",
        PRODUCT_CODE: "product_code",
        IS_ACTIVE: "is_active",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

module.exports = {
    BARCODE_CONFIG,
    BARCODE_LIST
};
