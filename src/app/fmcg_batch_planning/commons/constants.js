const PRODUCT_PLAN_MST = {
    NAME: "productplanmst",
    COLUMNS: {
        PMD_ID: "pmd_id",
        COM_ID: "pmd_comid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PRODUCT_PLAN_MST_DTL = {
    NAME: "productplanmstdtl",
    COLUMNS: {
        ID: "id",
        PMD_ID: "pmd_id",
        SRLNO: "pmd_srlno",
        MAT_ID: "pmd_matid",
        QTY: "pmd_qty",
        UOM: "pmd_uom",
        FULL_QTY: "pmd_fullqty",
        PRD_QTY: "pmd_prdqty",
        COM_ID: "pmd_comid",
        TEMP: "pmd_temp",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

module.exports = {
    PRODUCT_PLAN_MST,
    PRODUCT_PLAN_MST_DTL
};
