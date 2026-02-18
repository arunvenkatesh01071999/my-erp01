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
        ALTER_MOBILE_NO: "alter_mobile_no",
        PURCHASE: "purchase",
        TRANSFER: "transfer",
        PRODUCT_TYPE: "product_type",
        PAYMENT_TERMS: "payment_terms",
        GST_STATUS: "gst_status",
        PAN_STATUS: "pan_status",
        FSSAI_EXPIRY: "fssai_expiry",
        REGION_ID: "region_id",
        OUTLET: "outlet",
        WAREHOUSE: "warehouse",
        IS_DSD: "is_dsd"
    }
};


const SUPPLIER_ORDER_DAYS = {
    NAME: "supplier_order_days",
    COLUMNS: {
        ID: "id",
        SUPPLIER_ID: "supplier_id",
        SUNDAY: "sunday",
        MONDAY: "monday",
        TUESDAY: "tuesday",
        WEDNESDAY: "wednesday",
        THURSDAY: "thursday",
        FRIDAY: "friday",
        SATURDAY: "saturday",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
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


const PURCHASE_ORDER_MASTER = {
    NAME: "purchaseorder_fmcg_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        PONO: "pono",
        PODATE: "podate",
        SUPPLIER_ID: "supplier_id",
        EXPIRY_DATE: "expiry_date",
        APPROVAL: "approval",
        UN_APPROVAL_COMMENTS: "un_approval_comments",
        COMPANY_ID: "company_id",
        TOTAL_ITEMS: "total_items",
        TOTAL_ORDER_QTY: "total_order_qty",
        SUB_TOTAL_AMT: "sub_total_amt",
        TOTAL_GST_AMT: "total_gst_amt",
        TOTAL_CESS_AMT: "total_cess_amt",
        ROFF: "roff",
        GRAND_TOTAL_AMT: "grand_total_amt",
        GRN_NO: "grn_no",
        IS_GRN_COMPLETE: "is_grn_complete",
        PO_TYPE: "po_type",
        MBQ_REF_NO: "mbq_ref_no",
        PO_REF_NO: "po_ref_no",
        EXPIRED: "expired",
        AMENDMENT: "amendment",
        IS_APPROVED_BY: "is_approved_by",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};


const SUPPLIER_DESPATCH_DAYS = {
    NAME: "supplier_despatch_days",
    COLUMNS: {
        ID: "id",
        SUPPLIER_ID: "supplier_id",
        SUNDAY: "sunday",
        MONDAY: "monday",
        TUESDAY: "tuesday",
        WEDNESDAY: "wednesday",
        THURSDAY: "thursday",
        FRIDAY: "friday",
        SATURDAY: "saturday",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
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
        UPDATED_BY: "updated_by",
        SUNDAY: "sunday",
        MONDAY: "monday",
        TUESDAY: "tuesday",
        WEDNESDAY: "wednesday",
        THURSDAY: "thursday",
        FRIDAY: "friday",
        SATURDAY: "saturday"
    }
};

const SUPPLIER_OUTLET_MAPPING = {
    NAME: "supplier_outlet_mapping",
    COLUMNS: {
        ID: "id",
        SUPPLIER_ID: "supplier_id",
        CUSTOMER_CODE: "customer_code",
        CUSTOMER_NO: "customer_no",
        OUTLET_ID: "outlet_id",
        SUPPLIER_CODE: "supplier_code",
        SUPPLIER_NAME: "supplier_name",
        LOCAL_SUPPLIER_MAPPING: "local_supplier_mapping",
        ACTION_FLAG: "action_flag",
        ADD1: "add1",
        ADD2: "add2",
        COUNTRY_ID: "country_id",
        STATE_ID: "state_id",
        CITY_ID: "city_id",
        PINCODE: "pincode",
        PHONE: "phone",
        EMAIL: "email",
        ALTER_EMAIL: "alter_email",
        MOBILE: "mobile",
        OP_BAL: "op_bal",
        TDS_BALANCE: "tds_balance",
        BALANCE: "balance",
        GST_TYPE: "gst_type",
        BANK_AC_NO: "bank_ac_no",
        BANKNAME: "bankname",
        AC_NAME: "ac_name",
        IFSCCODE: "ifsccode",
        GSTIN: "gstin",
        FSSAINO: "fssaino",
        PAN_NUMBER: "pan_number",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        SUNDAY: "sunday",
        MONDAY: "monday",
        TUESDAY: "tuesday",
        WEDNESDAY: "wednesday",
        THURSDAY: "thursday",
        FRIDAY: "friday",
        SATURDAY: "saturday",
        BRAND_COMPANY_ID: 'brand_company_id',
        CONTACT_PERSON: 'contact_person',
        REGION_ID: "region_id"
    }
};


const SUPPLIER_WAREHOUSE_MAPPING = {
    NAME: "supplier_warehouse_mapping",
    COLUMNS: {
        ID: "id",
        SUPPLIER_ID: "supplier_id",
        WAREHOUSE_ID: "warehouse_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        SUPPLIER_CODE: "supplier_code"
    }
};


const SUPPLIER_DOCUMENTS = {
    NAME: "supplier_documents",
    COLUMNS: {
        ID: "id",
        SUPPLIER_ID: "supplier_id",
        DOCUMENT_NAME: "document_name",
        DOCUMENT_URL: "document_url",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        DOCUMENT_TYPE: "document_type"
    }
};

const VENDORS_OUTLET_MAPPING = {
    NAME: "vendors_outlet_mapping",
    COLUMNS: {
        ID: "id",
        VENDORS_ID: "vendor_id",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        PRODUCT_CODE: "pro_code"
    }
};

const TYPEDESIGN = {
    NAME: "typedesign",
    COLUMNS: {
        ID: "id",
        TYPE_NAME: "type_name",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


const OUTLET_SUPPLIER_ORDERDAYS = {
    NAME: "outlet_supplier_orderdays",
    COLUMNS: {
        ID: "id",
        OUTLET_ID: "outlet_id",
        SUPPLIER_ID: "supplier_id",
        BRAND_COMPANY_ID: "brand_company_id",
        COMPANY_ID: "company_id",
        SUNDAY: "sunday",
        MONDAY: "monday",
        TUESDAY: "tuesday",
        WEDNESDAY: "wednesday",
        THURSDAY: "thursday",
        FRIDAY: "friday",
        SATURDAY: "saturday",
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
    SUPPLIER_ORDER_DAYS,
    SUPPLIER_DESPATCH_DAYS,
    PURCHASE_MASTER,
    COMPANY,
    VENDORS_MAPPING,
    PURCHASE_ORDER_MASTER,
    SUPPLIER_OUTLET_MAPPING,
    SUPPLIER_WAREHOUSE_MAPPING,
    SUPPLIER_DOCUMENTS,
    WAREHOUSE,
    VENDORS_OUTLET_MAPPING,
    TYPEDESIGN,
    OUTLET_SUPPLIER_ORDERDAYS
}
