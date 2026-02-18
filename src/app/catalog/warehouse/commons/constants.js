const WAREHOUSE_LOGS = {
    NAME: "warehouse_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        WAREHOUSE_ID: "warehouse_id",
        WAREHOUSE_NAME: "warehouse_name",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date"
    }
};

const WAREHOUSE = {
    NAME: "warehouse",
    COLUMNS: {
        ID: "id",
        WAREHOUSE_NAME: "warehouse_name",
        SHORT_NAME: "short_name",
        ADD1: "add1",
        ADD2: "add2",
        ADD3: "add3",
        ADD4: "add4",
        PINCODE: "pincode",
        PHONE: "phone",
        MOBILE: "mobile",
        EMAIL: "email",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        COUNTRY: "country",
        CITYID: "city_id",
        STATEID: "state_id",
        COUNTRYID: "country_id",
        LIMITATION: "limitation",
        GSTIN: "gstin",
        FSSAI: "fssai",
        ISGST: "is_gst",
        WALLET_BALANCE: "wallet_balance",
        BANKACNO: "bankacno",
        BANKNAME: "bankname",
        ACNAME: "acname",
        IFSCCODE: "ifsccode",
        MAIN_WAREHOUSE: "main_warehouse",
        CONTACT_NAME: "contact_name",
        BANKID: "bank_id"
    }
};

const PURCHASE_MST = {
    NAME: "purchase_master",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PARTYCODE: "partycode",
        AMOUNT: "amount",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        ROFF: "roff",
        FREIGHT_CHARGES: "freight_charges",
        OTHER_CHARGES: "other_charges",
        PONO: "pono",
        PODATE: "podate",
        PARTYDC: "partydc",
        OUTSTANDING: "outstanding",
        PARTYDCDATE: "partydcdate",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_BARCODE_GENERATED: "is_barcode_generated",
        PURCHASE_TYPE: "purchase_type",
        WH_ID: "wh_id"

    }
};

const SUPPLIER = {
    NAME: "supplier",
    COLUMNS: {
        ID: "id",
        SUPPLIER_CODE: "supplier_code",
        SHORTNAME: "short_name",
        SUPPLIER_NAME: "supplier_name",
        TYPE: "type",
        MOBILE: "mobile",
        PHONE: "phone",
        COMPANY_ID: "company_id",
        COUNTRY_ID: "country_id",
        STATE_ID: "state_id",
        CITY_ID: "city_id",
        ADD1: "add1",
        ADD2: "add2",
        ADD3: "add3",
        ADD4: "add4",
        PINCODE: "pincode",
        EMAIL: "email",
        ALTER_EMAIL: "alter_email",
        WEBSITE: "website",
        OP_BAL: "op_bal",
        BALANCE: "balance",
        GST_TYPE: "gst_type",
        BANK_AC_NO: "bank_ac_no",
        BANKNAME: "bankname",
        AC_NAME: "ac_name",
        IFSCCODE: "ifsccode",
        PAN_NUMBER: "pan_number",
        GSTIN: "gstin",
        FSSAI: "fssaino",
        MONTH_DAYS: "month_days",
        IS_ACTIVE: "is_active",
        APPROVAL: "approval",
        WAREHOUSE_TYPE: "warehouse_type",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        MSME_APPLICABLE: "msme_applicable",
        MSME_NUMBER: "msme_number",
        MSME_DECLARATION: "msme_declaration",
        CREDIT_DAYS: "credit_days",
        TOT_MARGIN_PERCENTAGE: "tot_margin_percentage",
        TOT_MARGIN_VALUE: "tot_margin_value",
        CONTACT_PERSON: "contact_person",
        DESIGNATION: "designation",
        ALTER_MOBILE_NO: "alter_mobile_no"
    }
};


const WAREHOUSE_COMPANY_MAPPING = {
    NAME: "warehouse_company_mapping",
    COLUMNS: {
        ID: "id",
        WAREHOUSE_ID: "warehouse_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


const REGION = {
    NAME: "region",
    COLUMNS: {
        ID: "id",
        REGION_ID: "region_id",
        REGION_NAME: "region_name",
        PREFIX: "prefix"
    }
};

module.exports = {
    WAREHOUSE,
    WAREHOUSE_LOGS,
    SUPPLIER,
    PURCHASE_MST,
    WAREHOUSE_COMPANY_MAPPING,
    REGION
}