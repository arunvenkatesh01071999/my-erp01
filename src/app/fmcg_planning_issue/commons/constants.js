const PRODUCT_PLAN_HDR = {
    NAME: "productplanhdr",
    COLUMNS: {
        PP_ID: "pp_id",
        PP_DATE: "pp_date",
        PP_TIME: "pp_time",
        PP_KIT_ISS_MST: "pp_kitissmst",
        PP_UID: "pp_uid",
        PP_CID: "pp_cid",
        PP_YEAR: "pp_year",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PRODUCT_PLAN_DTL = {
    NAME: "productplandtl",
    COLUMNS: {
        ID: "id",
        PPD_ID: "ppd_id",
        SERIAL_NO: "ppd_srlno",
        MATERIAL_ID: "ppd_matid",
        QUANTITY: "ppd_qty",
        TIN: "ppd_tin",
        CID: "ppd_cid",
        YEAR: "ppd_year",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PRODUCT_PLAN_REQ = {
    NAME: "productplanreq",
    COLUMNS: {
        ID: "id",
        PPR_ID: "ppr_id",
        SERIAL_NO: "ppr_srlno",
        MATERIAL_ID: "ppr_matid",
        QUANTITY: "ppr_qty",
        AVAILABLE_QUANTITY: "ppr_availqty",
        COST: "ppr_cost",
        CID: "ppr_cid",
        YEAR: "ppr_year",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const STOCKLEDGER = {
    NAME: "stockledger",
    COLUMNS: {
        ID: "id",
        DATE: "date",
        PROD_ID: "prod_id",
        PARCHASE_QTY: "purchase_qty",
        SALE_QTY: "sale_qty",
        PURCHASE_RETURN_QTY: "purchase_return_qty",
        WASTAGE_QTY: "wastage_qty",
        ADJUST_QTY: "adjust_qty",
        FREE_QTY: "free_qty",
        SALES_IN_QTY: "sales_in_qty",
        SALES_RETURN_QTY: "sales_return_qty",
        TR_IN_QTY: "tr_in_qty",
        TR_OUT_QTY: "tr_out_qty",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        WH_ID: "wh_id"
    }
};

module.exports = {
    PRODUCT_PLAN_HDR,
    PRODUCT_PLAN_DTL,
    PRODUCT_PLAN_REQ,
    STOCKLEDGER
};