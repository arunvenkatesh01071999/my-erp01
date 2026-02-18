const CLOSINGCASHMST = {
  NAME: "closing_cash_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    TOTAL: "total",
    OUTLET_ID: "outlet_id",//
    SALESMAN_ID: "salesman_id",
    TOTAL_INVOICES: "total_invoices",
    TOTAL_SALES: "total_sales",
    TOTAL_CARD: "total_card",//
    TOTAL_CASH: "total_cash",
    TOTAL_UPI: "total_upi",//
    TOTAL_RETURN: "total_return",
    TOTAL_RETURN_USED: "total_return_used",
    TOTAL_LOYALTY: "total_loyalty",
    TOTAL_RETURN_COUNT: "total_return_count",
    AVG_BILLS: "avg_bills",
    AMOUNT_TO_BE_DEPOSITED: "amount_be_deposited",
    NEXT_DAY_BALANCE: "next_day_balance",
    TOTAL_LESS_AMOUNT: "total_less_amount",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const CLOSINGCASHDETAILS = {
  NAME: "closing_cash_details",
  COLUMNS: {
    ID: "id",
    CLOSING_CASH_MST_ID: "closing_cash_mst_id",
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
  CLOSINGCASHMST,
  CLOSINGCASHDETAILS
};