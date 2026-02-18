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

const TYPE_DESIGN_LOGS = {
    NAME: "type_design_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        TYPE_DESIGN_ID: "type_design_id",
        USER_ID: "user_id",
        COMPANY_ID: "company_id",
        TYPE_NAME: "type_name",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date"
    }
};

module.exports = {
    TYPEDESIGN,
    TYPE_DESIGN_LOGS
}