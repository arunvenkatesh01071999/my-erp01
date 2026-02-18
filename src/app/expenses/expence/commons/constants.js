const EXPENSES = {
  NAME: "expenses",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    ACC_ID: "accid",
    AMOUNT: "amount",
    REMARKS: "remarks",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    WAREHOUSE_ID: "warehouse_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const EXPENCE_LEDGER = {
  NAME: "expense_ledger",
  COLUMNS: {
    ID: "id",
    WAREHOUSE_ID: "warehouse_id",
    EDATE: "edate",
    ACC_ID: "accid",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// CREATE TABLE sub_accountmaster (
//   id SERIAL PRIMARY KEY,
//   acc_id INTEGER,
//   sub_account_name VARCHAR(1000),  
//   is_active BOOLEAN DEFAULT true,  
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
// );


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


const EXPENSES_DETAILS = {
  NAME: "expences_details",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    EXPENCES_ID: "expenses_id",
    ACC_ID: "accid",
    SUB_ACC_ID: "sub_acc_id",
    AMOUNT: "amount",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};






module.exports = {
  EXPENSES,
  EXPENCE_LEDGER,
  EXPENSES_DETAILS,
  SUB_ACCOUNT_MASTER
};
