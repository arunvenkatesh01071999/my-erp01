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

const RE_DETAILS = {
    NAME: "re_details",
    COLUMNS: {
        ID: "id",
        LOC_ID: "loc_id",
        PRO_ID: "pro_id",
        TR_ID:"tr_id",
        RATE: "rate",
        ONLINE_RATE: "online_rate",
        STATUS: "status",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        CLIENTID: "clientid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
    }
};

module.exports = {
    MAIN_CATEGORY,
    RE_DETAILS
}