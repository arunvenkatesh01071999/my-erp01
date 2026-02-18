const WASTAGEMASTER = {
  NAME: "wastage_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    AMOUNT: "amount",
    TOTALQTY: "totalqty",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WASTAGEOUTLETMASTER = {
  NAME: "wastage_outlet_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    AMOUNT: "amount",
    TOTALQTY: "totalqty",
    COMPANY_ID: "company_id",
    UID: "uid",
    OUTLET_ID: "outlet_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WASTAGEDETAIL = {
  NAME: "wastage_detail",
  COLUMNS: {
    ID: "id",
    WM_ID: "wm_id",
    DATE: "date",
    PRODID: "prodid",
    QTY: "qty",
    RATE: "rate",
    AMOUNT: "amount",
    REASON: "reason",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WASTAGEOUTLETDETAIL = {
  NAME: "wastage_outlet_detail",
  COLUMNS: {
    ID: "id",
    WOM_ID: "wom_id",
    DATE: "date",
    PRODID: "prodid",
    OUTLET_ID: "outlet_id",
    QTY: "qty",
    RATE: "rate",
    AMOUNT: "amount",
    REASON: "reason",
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
    TR_IN_QTY: "tr_in_qty",
    TR_OUT_QTY: "tr_out_qty",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

module.exports = {
  WASTAGEMASTER,
  WASTAGEDETAIL,
  STOCKLEDGER,
  WASTAGEOUTLETMASTER,
  WASTAGEOUTLETDETAIL
};