const CLOSINGEXPENCES_WH_MST = {
  NAME: "closing_expences_wh_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    SALESMAN_ID: "salesman_id",
    OPENING_BALANCE: "opening_balance",
    EXPENCES_AMOUNT: "expences_amount",
    CLOSING_BALANCE: "closing_balance",
    TOTAL_AMOUNT: "total_amount",
    WAREHOUSE_ID: "warehouse_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const CLOSINGEXPENCES_WH_DETAILS = {
  NAME: "closing_expences_wh_details",
  COLUMNS: {
    ID: "id",
    CLOSING_EXPENCES_WH_MST_ID: "closing_expences_wh_mst_id",
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
  CLOSINGEXPENCES_WH_MST,
  CLOSINGEXPENCES_WH_DETAILS
};