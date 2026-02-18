const POSETTINGS = {
  NAME: "posettings",
  COLUMNS: {
    ID: "id",
    LOC_ID: "locid",
    CODE: "code",
    SALEDAYS: "saledays",
    TIMES: "times",
    MINMBQ: "minmbq",
    MAXMBQ: "maxmbq",
    FLAG: "flag",
    U_ID: "u_id",
    TS: "TS",
    CTYPE: "ctype",
    VLT: "vlt",
    PAWAY: "paway",
    PACKQTY: "packqty",
    CREATED_AT: "created_at",
    LASTUPDATE: "lastupdate",
    OUTLET_ID: "outlet_id"
  }
};

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
    BALANCE: "balance",
    CREDIT_LIMIT: "credit_limit",
    LIMITATION: "limitation",
    WALLET_BALANCE: "wallet_balance",
    REF_DOC_NO: "ref_doc_no",
    FOR_INDENT: "for_indent",
    WAREHOUSE_ID: "warehouse_id",
    REGION_ID: "region_id",

  }
};
const POSETTINGSTEST = {
  NAME: "posettings",
  COLUMNS: {
    LOCID: "locid",
    CODE: "code",
    SALEDAYS: "saledays",
    TIMES: "times",
    MINMBQ: "minmbq",
    FLAG: "flag",
    U_ID: "u_id",
    LASTUPDATE: "lastupdate",
    CTYPE: "ctype",
    VLT: "vlt",
    PAWAY: "paway",
    PACKQTY: "packqty"
  }
};

module.exports = {
  POSETTINGS,
  POSETTINGSTEST,
  OUTLETS
};
