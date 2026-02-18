const HEADS = {
    NAME: "heads",
    COLUMNS: {
        ID: "id",
        CATEOGORY_NAME: "cateogory_name",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        IS_INSERTED: "is_inserted",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const HEADS_LOGS = {
    NAME: "heads_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        HEADS_ID: "heads_id",
        COMPANY_ID: "company_id",
        CATEGORY_NAME: "category_name",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date"
    }
};


module.exports = {
    HEADS,
    HEADS_LOGS
}