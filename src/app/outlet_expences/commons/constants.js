const OUTLET_EXPENSES = {
  NAME: "outlet_expenses",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    ACC_ID: "accid",
    AMOUNT: "amount",
    REMARKS: "remarks",
    OUTLET_ID: "outletid",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const OUTLET_EXPENCE_LEDGER = {
  NAME: "outlet_expense_ledger",
  COLUMNS: {
    ID: "id",
    EDATE: "edate",
    ACC_ID: "accid",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    OUTLET_ID: "outlet_id"
  }
};

const OUTLET_EXPENSES_DETAILS = {
  NAME: "outlet_expences_details",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    OUTLET_EXPENCES_ID: "outlet_expenses_id",
    ACC_ID: "accid",
    SUB_ACC_ID: "sub_acc_id",
    AMOUNT: "amount",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const SUB_ACCOUNT_MASTER = {
  NAME: "sub_accountmaster",
  COLUMNS: {
    ID: "id",
    ACC_ID: "acc_id",
    SUB_ACC_NAME: "sub_account_name",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};







module.exports = {
  OUTLET_EXPENSES,
  OUTLET_EXPENCE_LEDGER,
  OUTLET_EXPENSES_DETAILS,
  SUB_ACCOUNT_MASTER
};
