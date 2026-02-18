const COMPANY = {
  NAME: "company",
  COLUMNS: {
    ID: "id",
    CODE: "code",
    SHORTNAME: "company_short_name",
    FULLNAME: "company_fullname",
    ADD1: "add1",
    ADD2: "add2",
    ADD3: "add3",
    ADD4: "add4",
    CITY: "city",
    PINCODE: "pincode",
    STATE: "state",
    COUNTRY: "country",
    PHONE: "phone",
    MOBILE: "mobile",
    EMAIL: "email",
    WEBSITE: "website",
    GSTIN: "gstin",
    FSSAI: "fssai",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const COMPANY_BANK_DETAILS = {
  NAME: "company_bank_details",
  COLUMNS: {
    ID: "id",
    COMPANY_ID: "company_id",
    BANKACNO: "bankacno",
    BANKNAME: "bankname",
    ACNAME: "acname",
    IFSCCODE: "ifsccode",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const COMPANY_LOGS = {
  NAME: "company_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    COMPANY_ID: "company_id",
    COMPANY_NAME: "company_name",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};

module.exports = {
  COMPANY,
  COMPANY_BANK_DETAILS,
  COMPANY_LOGS
};
