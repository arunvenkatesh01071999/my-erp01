const CLOSINGEXPENCESMST = {
  NAME: "closing_expences_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    OPENING_BALANCE: "opening_balance",
    EXPENCES_AMOUNT: "expences_amount",
    CLOSING_BALANCE: "closing_balance",
    TOTAL_AMOUNT: "total_amount",
    OUTLET_ID: "outlet_id",
    SALESMAN_ID: "salesman_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const CLOSINGEXPENCESDETAILS = {
  NAME: "closing_expences_details",
  COLUMNS: {
    ID: "id",
    CLOSING_EXPENCES_MST_ID: "closing_expences_mst_id",
    DATE: "date",
    DENOMINATION: "denomination",
    COUNT: "count",
    TOTAL: "total",
    OUTLET_ID: "outlet_id",
    SALESMAN_ID: "salesman_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};



module.exports = {
  CLOSINGEXPENCESMST,
  CLOSINGEXPENCESDETAILS
};