const OUTLET_WASTAGE_MASTER = {
    NAME: "outlet_wastage_master",
    COLUMNS: {
        W_ID: "w_id",
        OUTLET_ID: "outlet_id",
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
        W_PACKID: "w_packid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const OUTLET_WASTAGE_DETAILS = {
    NAME: "outlet_wastage_details",
    COLUMNS: {
        ID: "id",
        OUTLET_WASTAGE_MASTER_ID: "outlet_wastage_master_id",
        OUTLET_ID: "outlet_id",
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
        WD_WH_STOCK: "wd_whstock",
        WD_DNE: "wd_dne",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};



module.exports = {
    OUTLET_WASTAGE_MASTER,
    OUTLET_WASTAGE_DETAILS
};
