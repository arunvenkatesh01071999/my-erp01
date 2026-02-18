const HEADS = {
    NAME: "heads",
    COLUMNS: {
        ID: "id",
        CATEOGORY_NAME: "cateogory_name",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const CONSUMER = {
    NAME: "consumer",
    COLUMNS: {
        ID: "id",
        CONSUMER_NAME: "consumer_name",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const TYPEDESIGN = {
    NAME: "typedesign",
    COLUMNS: {
        ID: "id",
        TYPE_NAME: "type_name",
        TYPE_ID: "type_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

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
const WAREHOUSE = {
    NAME: "warehouse",
    COLUMNS: {
        ID: "id",
        WHNAME: "wh_name",
        SHORT_NAME: "short_name",
        ADD1: "add1",
        ADD2: "add2",
        ADD3: "add3",
        ADD4: "add4",
        CITY: "city",
        PINCODE: "pincode",
        STATE: "state",
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
        //new
        GSTIN: "gstin",
        FSSAI: "fssai",
        ISGST: "is_gst",
        WALLET_BALANCE: "wallet_balance",
        BANKACNO: "bankacno",
        BANKNAME: "bankname",
        ACNAME: "acname",
        IFSCCODE: "ifsccode",
        MAIN_WAREHOUSE: "main_warehouse",
        CONTACT_NAME: "contact_name"
        //fields
    }
};

const SALESMAN = {
    NAME: "salesman",
    COLUMNS: {
        ID: "id",
        SALESMANCODE: "sales_man_code",
        SALESMANNAME: "sales_man_name",
        SHORT_NAME: "short_name",
        FATHER_NAME: "father_name",
        MOTHER_NAME: "mother_name",
        CODE: "code",
        ADD1: "add1",
        ADD2: "add2",
        ADD3: "add3",
        DOB: "dob",
        SEX: "sex",
        MOBILE: "mobile",
        PHOTO: "photo",
        ID_PROOF: "id_proof",
        PASSBOOK: "passbook",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
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
        IS_DSD: "is_dsd",
        REGION_ID: "region_id"
    }
};


const ITEM = {
    NAME: "item",
    COLUMNS: {
        ID: "id",
        PRODUCT_CODE: "pro_code",
        SHORT_NAME: "short_name",
        PRO_DESCRIPTION: "pro_description",
        REGIONAL_NAME: "regional_name",
        PRODUCT_NAME: "pro_name",
        COMPANY_ID: "company_id",
        TYPE_ID: "type_id",
        MAIN_CATEGORY_ID: "main_catgory_id",
        SUB_CATEGORY_ID: "sub_category_id",
        HEAD_ID: "head_id",
        TYPEDESIGN_ID: "typedesign_id",
        MAIN_UOM_ID: "main_uom_id",
        UOM_ID: "uom_id",
        MRP: "mrp",
        PURCHASE_RATE: "pur_rate",
        SALE_RATE: "sale_rate",
        WHOLESALE_RATE: "wholesale_rate",
        GST: "gst",
        CESS: "cess",
        HSN: "hsn",
        OPENING_STOCK: "op_stk",
        MIN_STOCK: "min_stock",
        BALANCE: "balance",
        INCHARGE_ID: "incharge_id",
        TRAY_ID: "tray_id",
        EXPIRY_TYPE_ID: "expiry_type_id",
        EXPIRY_VALUE: "expiry_value",
        MBQ: "mbq",
        SHRINKAGE: "shrinkage",
        CASE_QTY: "case_qty",
        PUTAWAY: "putaway",
        BULK_ITEM: "bulk_item",
        RETURNABLE_ITEM: "returnable_item",
        PURCHASE: "purchase",
        MIN_STOCK_WARNING: "min_stock_warning",
        BATCH_ITEM: "batch_item",
        ALLOW_NEG_STK: "allow_neg_stk",
        GST_INCLUSIVE: "gst_inclusive",
        WSCALE: "wscale",
        OUTLET_PURCHASE: "outlet_purchase",
        CONVERSION_FACTOR: "convertion_factor",
        DISCOUNT: "discount",
        MAIN_PRODUCT_ID: "main_product_id",
        MAIN_PRODUCT_QTY: "main_product_qty",
        MERCHANT_CATEGORY_ID: "merchant_category_id",
        //add column
        PARENT_PRODUCT_ID: "parent_product_id",
        OUTLET_PRODUCT_ID: "outlet_product_id",
        MARGIN: "margin",
        PRODUCT_WEIGHT: "product_weight",
        PACK_PRODUCT_ID: "pack_product_id",
        PACK_QTY: "pack_qty",
        WASTAGE: "wastage",
        SESSION_ID: "session_id",
        OUTLET_RATE: "outlet_rate",
        SELF_LIFE: "self_life",
        SALES_MARGIN: "sales_margin",
        OUTLET_PURCHASE: "outlet_purchase",
        WAREHOUSE_MARGIN: "warehouse_margin",
        SALES_MARGIN_NEW: "sales_margin_new",
        ORDER_QTY: "order_qty",
        PRIORITY: "priority",
        PRIMARY_ITEM: "primaryitem",
        WH_STOCK_DAY: "whstockday",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_INSERTED: "is_inserted",
        FIXEDMARGIN: "fixedmargin",
        VENDORDISCOUNTTYPE: "vendordiscounttype",
        VENDORDISCOUNTVALUE: "vendordiscountvalue",
    }
};


const OUTLET_PRODUCT_MAPPING = {
    NAME: "outlet_products_mapping",
    COLUMNS: {
        ID: "id",
        PRODUCT_ID: "pro_id",
        PRODUCT_CODE: "pro_code",
        OUTLET_PRODUCT_ID: "outlet_product_id",
        OUTLET_ID: "outlet_id",
        PURCHASE_RATE: "purchase_rate",
        SALES_RATE: "sales_rate",
        MRP: "mrp",
        GST: "gst",
        CESS: "cess",
        OPENING_STOCK: "opening_stock",
        BALENCE_STOCK: "balance_stock",
        HSN: "hsn",
        MBQ: "mbq",
        MBQ_DAYS: "mbqdays",
        PURCHASE_MARGIN: "purchase_margin",
        PACK_QTY: "pack_qty",
        BARCODE: "barcode",
        BARCODE1: "barcode1",
        BARCODE2: "barcode2",
        BARCODE3: "barcode3",
        BARCODE4: "barcode4",
        COMPANY_ID: "company_id",
        SUPPLIER_ID: "supplier_id",
        MIN_STOCK: "min_stock",
        OUTLET_PURCHASE: "outlet_purchase",
        OUTLET_NON_SALEABLE: "outlet_non_saleable",
        LOCAL_OUTLET_PURCHASE: "local_outlet_purchase",
        ALLOW_NEG_STK: "allow_neg_stk",
        WSCALE: "wscale",
        MIN_WARN_STOCK: "min_warn_stock",
        IS_ACTIVE: "is_active",
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
        UPDATED_BY: "updated_by",
        FIXEDMARGIN: "fixedmargin",
        VENDORDISCOUNTTYPE: "vendordiscounttype",
        VENDORDISCOUNTVALUE: "vendordiscountvalue",
        BRAND_COMPANY_ID: "brand_company_id"
    }
};


const BARCODE_LIST = {
    NAME: "barcode_list",
    COLUMNS: {
        ID: "id",
        PROD_ID: "prod_id",
        BARCODE: "barcode",
        PRODUCT_CODE: "product_code",
        IS_ACTIVE: "is_active",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        PURCHASE_NO: "purchase_no",
        IS_VERIFIED: "is_verified"
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

const SALESMAN_OUTLET_MAPPING = {
    NAME: "salesman_outlet_mapping",
    COLUMNS: {
        ID: "id",
        SALESMAN_ID: "salesman_id",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const TRANSACTION_PROVIDER = {
    NAME: "transaction_provider_master",
    COLUMNS: {
        ID: "id",
        TRANSACTION_PROVIDER: "transaction_provider",
        MERCHANT_ID: "merchant_id",
        MERCHANT_KEY: "merchant_key",
        URL: "url",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const TRANSACTION_TYPE = {
    NAME: "transaction_type_master",
    COLUMNS: {
        ID: "id",
        TRANSACTION_TYPE: "transaction_type",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const PAY_TYPE_MASTER = {
    NAME: "pay_type_master",
    COLUMNS: {
        ID: "id",
        PAY_TYPE_NAME: "pay_type_name",
        PAY_TYPE_KEY: "pay_type_key",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const OUTLETMEMBERS = {
    NAME: "outlet_members",
    COLUMNS: {
        ID: "id",
        MOBILE: "mobile",
        PARTY_NAME: "party_name",
        ADDRESS: "address",
        GET_IN: "gst_in",
        BALANCE_POINTS: "balance_points",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        SPOUSE_NAME: "spouse_name",
        SPOUSE_DOB: "spouse_dob",
        PARTY_DOB: "party_dob",
        ANNIVERSARY_DATE: "anniversary_date",
        NO_OF_CHILD: "no_of_child",
        IS_ACTIVE: "is_active"

    }
};
const ITEM_LOGS = {
    NAME: "item_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        ITEM_ID: "item_id",
        ITEM_NAME: "item_name",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date"
    }
};

const EXPIRY_TYPE = {
    NAME: "expiry_type",
    COLUMNS: {
        ID: "id",
        EXPIRY_NAME: "expiry_type_name",
    }
};

const PRODUCT_TYPE = {
    NAME: "product_type",
    COLUMNS: {
        ID: "id",
        PRODUCT_TYPE_NAME: "product_type_name",
    }
};


const PUTAWAY = {
    NAME: "putaway",
    COLUMNS: {
        ID: "id",
        PUTAWAY_TYPE: "putaway_type",
    }
};

const PICKER_PRODUCT_MAPPING = {
    NAME: "picker_products_mapping",
    COLUMNS: {
        ID: "id",
        PICKER_ID: "picker_id",
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
    HEADS,
    CONSUMER,
    TYPEDESIGN,
    ACCOUNTMASTER,
    WAREHOUSE,
    SALESMAN,
    SUPPLIER,
    ITEM,
    OUTLET_PRODUCT_MAPPING,
    BARCODE_LIST,
    VENDORS_MAPPING,
    SALESMAN_OUTLET_MAPPING,
    TRANSACTION_PROVIDER,
    TRANSACTION_TYPE,
    PAY_TYPE_MASTER,
    OUTLETMEMBERS,
    PICKER_PRODUCT_MAPPING,
    ITEM_LOGS,
    EXPIRY_TYPE,
    PUTAWAY,
    PRODUCT_TYPE
};
