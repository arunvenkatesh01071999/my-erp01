const OUTLETS = {
  NAME: "outlets",
  COLUMNS: {
    ID: "id",
    CODE: "code",
    SHORTNAME: "short_name",
    FULLNAME: "fullname",
    ADD1: "add1",
    ADD2: "add2",
    ADD3: "add3",
    ADD4: "add4",
    CITY_ID: "city_id",
    PINCODE: "pincode",
    STATE_ID: "state_id",
    COUNTRY_ID: "country_id",
    PHONE: "phone",
    MOBILE: "mobile",
    EMAIL: "email",
    WEBSITE: "website",
    GSTIN: "gstin",
    FSSAI: "fssai",
    OUTLETTYPE: "outlet_type",
    BANKACNO: "bankacno",
    BANKID: "bankid",
    BANKNAME: "bankname",
    ACNAME: "acname",
    IFSCCODE: "ifsccode",
    BALANCE: "balance",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    ISGST: "is_gst",
    FRANCHISETYPE: "franchise_type",
    // BALANCE: "balance",
    CREDIT_LIMIT: "credit_limit",
    LIMITATION: "limitation",
    WALLET_BALANCE: "wallet_balance",
    REF_DOC_NO: "ref_doc_no",
    FOR_INDENT: "for_indent",
    WAREHOUSE_ID: "warehouse_id",
    REGION_ID: "region_id"
  }
};
const OUTLETTYPE = {
  NAME: "outlet_type",
  COLUMNS: {
    ID: "id",
    OUTLETTYPE: "outlet_type",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const FRANCHISETYPE = {
  NAME: "franchise_type",
  COLUMNS: {
    ID: "id",
    FRANCHISETYPE: "franchise_type",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const OUTLET_LOGS = {
  NAME: "outlet_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    USER_NAME: "user_name",
    OUTLET_ID: "outlet_id",
    OUTLET_NAME: "outlet_name",
    OPERATION_DATE: "operation_date"
  }
};

const OUTLET_MAPPING = {
  NAME: "outlet_mapping",
  COLUMNS: {
    ID: "id",
    USER_ID: "user_id",
    OUTLET_ID: "outlet_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


module.exports = {
  OUTLETS,
  OUTLETTYPE,
  FRANCHISETYPE,
  OUTLET_LOGS,
  OUTLET_MAPPING
};
