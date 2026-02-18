const SUPPLIER_LOGS = {
    NAME: "supplier_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        SUPPLIER_ID: "supplier_id",
        SUPPLIER_NAME: "supplier_name",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date"
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


const SUB_GROUP = {
    NAME: "sub_group",
    COLUMNS: {
        ID: "id",
        NAME: "name",
        GROUP_ID: "group_id",
        SALES_MARGIN: "sales_margin",
        STATUS: "status",
        COMPANY_ID: "company_id",
        USER_ID: "user_id",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

const ALLOCATE_GROUP = {
    NAME: "allocate_group",
    COLUMNS: {
        ID: "id",
        NAME: "name",
        STATUS: "status",
        COMPANY_ID: "company_id",
        USER_ID: "user_id",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};


const CUSTOMER = {
    NAME: "customer",
    COLUMNS: {
        ID: "id",
        NAME: "name",
        SHORT_NAME: "short_name",
        GROUP_ID: "group_id",
        ALLOCATE_GROUP: "allocate_group",
        ADDRESS_ONE: "address_one",
        ADDRESS_TWO: "address_two",
        COUNTRIES: "countries",
        STATE: "state",
        CITY: "city",
        STATE_CODE: "state_code",
        PINCODE: "pincode",
        PHONE_NUM_ONE: "phone_num_one",
        PHONE_NUM_TWO: "phone_num_two",
        EMAIL: "email",
        WEB_SITE: "web_site",
        GSTIN: "gstin",
        CST: "cst",
        PAN_NUM: "pan_num",
        OPENING: "opening",
        BALANCE: "balance",
        WEB_ID: "web_id",
        LOCATION_ID: "location_id",
        WAREHOUSE_ID: "warehouse_id",
        EXPORT: "export",
        SALES_MARGIN: "sales_margin",
        CUSTOMER_TYPE: "customer_type",
        GST_TYPE: "gst_type",
        DEFAULT_CASH_SALES: "default_cash_sales",
        WEB_ORDER: "web_order",
        WEB_SALES_EXPORT: "web_sales_export",
        BULK_SALES: "bulk_sales",
        GROCERY_TRAY: "grocery_tray",
        MARGIN_ACTIVE: "margin_active",
        DELIVERY_ADDRESS_ONE: "delivery_address_one",
        DELIVERY_ADDRESS_TWO: "delivery_address_two",
        DELIVERY_COUNTRIES: "delivery_countries",
        DELIVERY_STATE: "delivery_state",
        DELIVERY_CITY: "delivery_city",
        DELIVERY_PINCODE: "delivery_pincode",
        DELIVERY_STATE_CODE: "delivery_state_code",
        STATUS: "status",
        IS_ACTIVE: "is_active",
        COMPANY_ID: "company_id",
        USER_ID: "user_id",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

const CUSTOMERS_ADDRESS = {
    NAME: "customers_address",
    COLUMNS: {
        ID: "id",
        CUSTOMERS_ID: "customers_id",
        ADDRESS_TYPE: "address_type",
        ADDRESS_LINE1: "address_line1",
        ADDRESS_LINE2: "address_line2",
        ADDRESS_LINE3: "address_line3",
        ALTERNATIVE_MOBILE: "alternative_mobile",
        LONGITUDE: "longitude",
        LATITUDE: "latitude",
        STATE: "state",
        CITY: "city",
        COUNTRY: "country",
        IS_DEFAULT: "is_default",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

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

const PURCHASE_MASTER = {
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

const VENDORS_MAPPING = {
    NAME: "vendors_mapping",
    COLUMNS: {
        ID: "id",
        VENDORS_ID: "vendors_id",
        PRODUCT_ID: "pro_id",
        PRODUCT_CODE: "pro_code",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

module.exports = {
    SUPPLIER,
    SUPPLIER_LOGS,
    PURCHASE_MASTER,
    COMPANY,
    VENDORS_MAPPING,
    CUSTOMER,
    CUSTOMERS_ADDRESS,
    SUB_GROUP,
    ALLOCATE_GROUP
}
