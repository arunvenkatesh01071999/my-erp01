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
    MAIN_CATEGORY,
    SUB_CATEGORY
}