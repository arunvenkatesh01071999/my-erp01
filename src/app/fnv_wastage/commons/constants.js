const WASTAGE_HDR = {
    NAME: "fvwastagehdr",
    COLUMNS: {
        W_ID: "w_id",
        W_YEAR: "w_year",
        W_DATE: "w_date",
        W_TOT: "w_tot",
        W_VAT_CST_AMT: "w_vatcstamt",
        W_GTOT: "w_gtot",
        W_UID: "w_uid",
        W_MUID: "w_muid",
        W_ROUND_OFF: "w_roundoff",
        W_COM_ID: "w_comid",
        W_PGTOT: "w_pgtot",
        W_OTHERS: "w_others",
        W_DEL_STAT: "w_delstat",
        W_REMARK: "w_remark",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const WASTAGE_DTL = {
    NAME: "fvwastagedtl",
    COLUMNS: {
        ID: "id",
        WD_ID: "wd_id",
        WD_YEAR: "wd_year",
        WD_DATE: "wd_date",
        WD_SLNO: "wd_slno",
        WD_PRDID: "wd_prdid",
        WD_BATCHNO: "wd_batchno",
        WD_EXPDATE: "wd_expdate",
        WD_QTY: "wd_qty",
        WD_DIS: "wd_dis",
        WD_DIS_AMT: "wd_disamt",
        WD_VAT: "wd_vat",
        WD_VAT_AMT: "wd_vatamt",
        WD_RATE: "wd_rate",
        WD_AMT: "wd_amt",
        WD_COM_ID: "wd_comid",
        WD_PRATE: "wd_prate",
        WD_PAMT: "wd_pamt",
        WD_SUPP_ID: "wd_suppid",
        WD_REASON_ID: "wd_reason_id",
        WD_TRAY: "wd_tray",
        WD_TRAYCOUNT: "wd_traycount",
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
const DNE_STOCK_LEDGER = {
    NAME: "dnestockledger",
    COLUMNS: {
        ID: "id",
        DL_DATE: "dl_date",
        DL_ITEMS: "dl_items",
        DL_INWARD: "dl_inward",
        DL_OUTWARD: "dl_outward",
        DL_UID: "dl_uid",
        DL_MUID: "dl_muid",
        DL_COM_ID: "dl_comid",
        DL_STK_CORR_QTY: "dl_stkcorrqty",
        DL_STK_CORR_FLAG: "dl_stkcorrflag",
        DL_SC_DATE: "dl_scdate",
        DL_SC_UID: "dl_scuid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const FVWASTAGE_TRAY_DTL = {
    NAME: "fvwastagetrydtl",
    COLUMNS: {
        ID: "id",
        WT_ID: "wt_id",
        WT_YEAR: "wt_year",
        WT_DATE: "wt_date",
        WT_SLNO: "wt_slno",
        WT_TRAYID: "wt_trayid",
        WT_QTY: "wt_qty",
        WT_COM_ID: "wt_comid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
module.exports = {
    WASTAGE_HDR,
    WASTAGE_DTL,
    STOCKLEDGER,
    DNE_STOCK_LEDGER,
    FVWASTAGE_TRAY_DTL
};
