const WAREHOUSE_EXPENSE_MASTER = {
  NAME: "warehouse_expense_master",
  COLUMNS: {
    ID: "id",
    DOC_NO: "doc_no",
    DOC_DATE: "doc_date",
    ACCOUNT_ID: "account_id",
    AMOUNT: "amount",
    REMARKS: "remarks",
    COMPANY_ID: "company_id",
    WAREHOUSE_ID: "warehouse_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WAREHOUSE_EXPENSE_DETAILS = {
  NAME: "warehouse_expense_details",
  COLUMNS: {
    ID: "id",
    WAREHOUSE_ID: "warehouse_id",
    DOC_DATE: "doc_date",
    DOC_NO: "doc_no",
    EXPENSES_MST_ID: "expenses_mst_id",
    ACCOUNT_ID: "account_id",
    SUB_ACCOUNT_ID: "sub_account_id",
    AMOUNT: "amount",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WAREHOUSE_EXPENSE_LEDGER = {
  NAME: "warehouse_expense_ledger",
  COLUMNS: {
    ID: "id",
    DOC_DATE: "doc_date",
    WAREHOUSE_ID: "warehouse_id",
    ACCOUNT_ID: "account_id",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

module.exports = {
  WAREHOUSE_EXPENSE_MASTER,
  WAREHOUSE_EXPENSE_DETAILS,
  WAREHOUSE_EXPENSE_LEDGER
};
