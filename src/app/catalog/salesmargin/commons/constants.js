const SALES_MARGIN_LOGS = {
    NAME: "sales_margin_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date",
        OPERATION_TIME: "operation_time "
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


const SALES_MARGIN = {
    NAME: "sales_margin",
    COLUMNS: {
        ID: "id",
        PRODUCT_ID: "product_id",
        PRODUCT_CODE: "product_code",
        PRODUCT_NAME: "product_name",
        HEAD_ID: "head_id",
        CATEGORY_ID: "category_id",
        HEAD_NAME: "head_name",
        CATEGORY_NAME: "category_name",
        COST_PRICE: "cost_price",
        GST: "gst",
        CESS: "cess",
        MARGIN: "margin",
        SALES_RATE: "sales_rate",
        MRP: "mrp",
        ACCEPTED_MARGIN: "accepted_margin",
        GRN_MARGIN: "grn_margin",
        SALES_MARGIN: "sales_margin",
        DISCOUNT: "discount",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const SALES_MARGIN_NEW = {
    NAME: "sales_margin_new",
    COLUMNS: {
        ID: "id",
        PRODUCT_ID: "product_id",
        PRODUCT_CODE: "product_code",
        PRODUCT_NAME: "product_name",
        TRANSPORT_KG: "transportKg",
        TRANSPORT: "transport",
        COVER: "cover",
        PRINTING: "printing",
        LABOUR: "labour",
        WASTAGE_PERCENTAGE: "wastage_percentage",
        MARGIN: "margin",
        WAREHOUSE_MARGIN: "warehouse_margin",
        BILLING_COST: "billing_cost",
        PROFIT: "profit",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const SALES_MARGIN_NEW_LOGS = {
    NAME: "sales_margin_new_logs",
    COLUMNS: {
        ID: "id",
        OPERATION_NAME: "operation_name",
        USER_ID: "user_id",
        USER_NAME: "user_name",
        OPERATION_DATE: "operation_date",
        OPERATION_TIME: "operation_time "
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
        CONVERSION_FACTOR: "convertion_factor",
        DISCOUNT: "discount",
        MAIN_PRODUCT_ID: "main_product_id",
        MAIN_PRODUCT_QTY: "main_product_qty",
        PARENT_PRODUCT_ID: "parent_product_id",
        PRODUCT_WEIGHT: "product_weight",
        PACK_PRODUCT_ID: "pack_product_id",
        PACK_QTY: "pack_qty",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_INSERTED: "is_inserted",
        MERCHANT_CATEGORY_ID: "merchant_category_id",
        MARGIN: "margin",
        OUTLET_RATE: "outlet_rate",
        SELF_LIFE: "self_life",
        SALES_MARGIN: "sales_margin",
        WAREHOUSE_MARGIN: "warehouse_margin",
        ORDER_QTY: "order_qty"
    }
};

const MAIN_CATEGORY = {
    NAME: "main_category",
    COLUMNS: {
        ID: "id",
        CATEGORY_NAME: "category_name",
        CATEGORY_IMAGE: "category_image",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active"
    }
};

const SUB_CATEGORY = {
    NAME: "sub_category",
    COLUMNS: {
        ID: "id",
        SUBCATEGORY_NAME: "subcategory_name",
        CATEGORY_ID: "category_id",
        SUBCATEGORY_IMAGE: "subcategory_image",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active"
    }
};

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

module.exports = {
    SALES_MARGIN,
    SALES_MARGIN_LOGS,
    SALES_MARGIN_NEW_LOGS,
    SALES_MARGIN_NEW,
    PURCHASE_MASTER,
    COMPANY,
    VENDORS_MAPPING,
    ITEM,
    MAIN_CATEGORY,
    SUB_CATEGORY,
    HEADS,
    SUPPLIER
}
