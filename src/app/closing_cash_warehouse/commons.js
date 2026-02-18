const CLOSINGCASH_WH_MST = {
  NAME: "closing_cash_wh_master",
  COLUMNS: {
    ID: "id",
    WAREHOUSE_ID: "warehouse_id",
    DATE: "date",
    TOTAL: "total",
    AMOUNT_TO_BE_DEPOSITED: "amount_be_deposited",
    NEXT_DAY_BALANCE: "next_day_balance",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};




const CLOSINGCASH_WH_DETAILS = {
  NAME: "closing_cash_wh_details",
  COLUMNS: {
    ID: "id",
    CLOSING_CASH_WH_MST_ID: "closing_cash_wh_mst_id",
    WAREHOUSE_ID: "warehouse_id",
    DATE: "date",
    DENOMINATION: "denomination",
    COUNT: "count",
    TOTAL: "total",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};



module.exports = {
  CLOSINGCASH_WH_MST,
  CLOSINGCASH_WH_DETAILS
};