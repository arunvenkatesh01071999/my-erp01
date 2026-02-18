const PLAN_INWARD_HDR = {
    NAME: "planinwardhdr",
    COLUMNS: {
        P_ID: "p_id",
        P_YEAR: "p_year",
        P_DATE: "p_date",
        P_UID: "p_uid",
        P_MUID: "p_muid",
        P_COM_ID: "p_comid",
        P_REMARK: "p_remark",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PLAN_INWARD_DTL = {
    NAME: "planinwarddtl",
    COLUMNS: {
        ID: "id",
        PD_ID: "pd_id",
        PD_YEAR: "pd_year",
        PD_DATE: "pd_date",
        PD_SLNO: "pd_slno",
        PD_PRDID: "pd_prdid",
        PD_BATCHNO: "pd_batchno",
        PD_EXPDATE: "pd_expdate",
        PD_QTY: "pd_qty",
        PD_COM_ID: "pd_comid",
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
        PURCHASE_QTY: "purchase_qty",
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
    PLAN_INWARD_HDR,
    PLAN_INWARD_DTL,
    STOCKLEDGER
};
