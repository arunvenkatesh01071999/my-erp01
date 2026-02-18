const CLOSINGSTOCK = {
  NAME: "closing_stock_outlet",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    PRODID: "prodid",
    BARCODE: "barcode",
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

const MISSING_STOCKS = {
  NAME: "missing_stocks",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    PRODID: "prodid",
    BARCODE: "barcode",
    PHYSICAL_QTY: "physical_qty",
    COMPUTER_QTY: "computer_qty",
    PURCHASE_RATE: "purchase_rate",
    SALES_RATE: "sales_rate",
    MRP: "mrp",
    OUTLET_ID: "outlet_id",
    COMPANY_ID: "company_id",
    IS_REACTIVATE: "is_reactivate",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
}

const PENDING_MISSING_STOCKS = {
  NAME: "pending_missing_stocks",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    PRODID: "prodid",
    BARCODE: "barcode",
    PHYSICAL_QTY: "physical_qty",
    COMPUTER_QTY: "computer_qty",
    PURCHASE_RATE: "purchase_rate",
    SALES_RATE: "sales_rate",
    MRP: "mrp",
    OUTLET_ID: "outlet_id",
    COMPANY_ID: "company_id",
    IS_PENDING: "is_pending",
    CAT_ID: "cat_id",
    SUB_CAT_ID: "sub_cat_id",
    SALES_MAN_ID: "sales_man_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
}

module.exports = {
  CLOSINGSTOCK,
  MISSING_STOCKS,
  PENDING_MISSING_STOCKS
};