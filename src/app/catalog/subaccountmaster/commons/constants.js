const ACCOUNTMASTER = {
  NAME: "accountmaster",
  COLUMNS: {
    ID: "id",
    ACNAME: "acname",
    ACTYPEID: "actype_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const SUB_ACCOUNTMASTER = {
  NAME: "sub_accountmaster",
  COLUMNS: {
    ID: "id",
    ACC_ID: "acc_id",
    SUB_ACCOUNT_NAME: "sub_account_name",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at"
  }
};


module.exports = {
  ACCOUNTMASTER,
  SUB_ACCOUNTMASTER
};
