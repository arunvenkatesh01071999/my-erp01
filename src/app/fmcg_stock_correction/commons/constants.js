const CLOSINGSTOCK = {
    NAME: "closing_stock",
    COLUMNS: {
        ID: "id",
        DOCDATE: "docdate",
        PRODID: "prodid",
        PHYSICAL_QTY: "physical_qty",
        COMPUTER_QTY: "computer_qty",
        PURCHASE_RATE: "purchase_rate",
        SALES_RATE: "sales_rate",
        MRP: "mrp",
        UID: "uid",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id",
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
        STK_CORRECT_QTY: "stk_correct_qty",
        STK_CORRECT_FLAG: "stk_correct_flag",
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
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


module.exports = {
    STOCKLEDGER,
    DNE_STOCK_LEDGER,
    CLOSINGSTOCK
};