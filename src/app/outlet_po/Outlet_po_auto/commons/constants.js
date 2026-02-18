const OUTLET_PO_DETAILS = {
  NAME: "outlet_po_details",
  COLUMNS: {
    ID: "id",
    OUTLET_PO_MASTER_ID: "outlet_po_master_id",
    FINANCIAL_YEAR: "financial_year",
    SERIAL_NO: "serial_no",
    PO_NO: "po_no",
    PO_DATE: "po_date",
    TYPE: "type",
    OUTLET_ID: "outlet_id",
    OUTLET_NAME: "outlet_name",
    SUPPLIER_ID: "supplier_id",
    PROD_CODE: "prod_code",
    PROD_ID: "prod_id",
    PROD_NAME: "prod_name",
    CATEGORY_ID: "category_id",
    CATEGORY_NAME: "category_name",
    BRAND_COMPANY_ID: "brand_company_id",
    UNIT_ID: "unit_id",
    HSN: "hsn",
    STK_HOLD: "stk_hold",
    BALANCE: "balance",
    STOCK_BALANCE: "stock_balance",
    TOTAL_BALANCE: "total_balance",
    SALES_QUANTITY: "sales_quantity",
    PHY_QTY: "phy_qty",
    T_QTY: "t_qty",
    PACK_QTY: "pack_qty",
    SYS_QTY: "sys_qty",
    REQ_QTY: "req_qty",
    ORD_QTY: "ord_qty",
    SUGG_QTY: "sugg_qty",
    QUANTITY: "quantity",
    AVERAGE_QTY: "average_qty",
    LOOSE_QTY: "loose_qty",
    CASE_QTY: "case_qty",
    RECEIVED_MEMO_QTY: "received_memo_qty",
    MRP: "mrp",
    MEMO_MRP: "memo_mrp",
    CP: "cp",
    MEMO_COST_PRICE: "memo_cost_price",
    GST: "gst",
    CGST: "cgst",
    SGST: "sgst",
    IGST: "igst",
    GST_AMOUNT: "gst_amount",
    CESS: "cess",
    CESS_AMOUNT: "cess_amount",
    RATE: "rate",
    LANDING_RATE: "landing_rate",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    TS: "ts",
    VLT: "vlt",
    DOH: "doh",
    PAWAY: "paway",
    MBQ: "mbq",
    MBQDAYS: "mbqdays",
    SALES_DAYS: "sales_days",
    STOCK_DAYS: "stock_days",
    MIN_MBQ: "min_mbq",
    FIXEDMARGIN: "fixedmargin",
    VENDORDISCOUNTTYPE: "vendordiscounttype",
    VENDORDISCOUNTVALUE: "vendordiscountvalue",
    FINAL_MBQ: "final_mbq",
    IS_MEMO_COMPLETE: "is_memo_complete",
    FINANCE_APPROVAL: "finance_approval",
    PO_SYNC: "po_sync",
    ACTION_FLAG: "action_flag",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    DOWN_TIME: "down_time",
    IS_MEMO_TEMP: "is_memo_temp"
  }
};
const VENDOR_MAIL = {
  NAME: "vendor_email",
  COLUMNS: {
    ID: "id",
    REGION_ID: "region_id",
    OUTLET_ID: "outlet_id",
    OUTLET_MAIL: "outlet_email",
    BRAND_COMPANY_ID: "brand_company_id",
    BRAND_COMPANY_MAIL: "brand_company_email",
    SUPPLIER_ID: "supplier_id",
    SUPPLIER_MAIL: "supplier_email",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};


const OUTLET_PO_MASTER = {
  NAME: "outlet_po_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    PO_DATE: "po_date",
    PO_NO: "po_no",
    OUTLET_PO_NO: "outlet_po_no",
    TYPE: "type",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    BRAND_COMPANY_ID: "brand_company_id",
    TOTAL_ITEMS: "total_items",
    TOTAL_ORDER_QTY: "total_order_qty",
    APPROVAL: "approval",
    IS_APPROVED_BY: "is_approved_by",
    UN_APPROVAL_COMMENTS: "un_approval_comments",
    SUB_TOTAL_AMT: "sub_total_amt",
    TOTAL_GST_AMT: "total_gst_amt",
    TOTAL_IGST_AMT: "total_igst_amt",
    TOTAL_CESS_AMT: "total_cess_amt",
    ROFF: "roff",
    GRAND_TOTAL_AMT: "grand_total_amt",
    EXPIRED: "expired",
    EXPIRY_DATE: "expiry_date",
    MAIL_SENT: "mail_sent",
    MAIL_SENT_AT: "mail_sent_at",
    SET_QTY_FLAG: "set_qty_flag",
    IS_MEMO_COMPLETE: "is_memo_complete",
    MEMO_NO: "memo_no",
    PO_ASSIGNED: "po_assigned",
    PO_ASSIGNED_BY: "po_assigned_by",
    PO_ASSIGNEE_NAME: "po_assignee_name",
    PO_ASSIGNED_AT: "po_assigned_at",
    IS_NORMAL: "is_normal",
    IS_QTY_MISMATCH: "is_qty_mismatch",
    IS_AMENDMENT: "is_amendment",
    IS_AMENDMENT_APPROVAL_STATUS: "is_amendment_approval_status",
    IS_AMENDMENT_APPROVAL_BY: "is_amendment_approval_by",
    IS_FINANCE_APPROVAL: "is_finance_approval",
    IS_FINANCE_APPROVAL_BY: "is_finance_approved_by",
    IS_GRN_APPROVAL: "is_grn_approval",
    IS_DEBITE_NOTE: "is_debit_note",
    DEBITE_NOTE_AMT: "debit_note_amt",
    COMPANY_ID: "company_id",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    PO_SYNC: "po_sync",
    DOWN_TIME: "down_time",
    PO_FINANCE_SENDER_ID: "po_finance_sender_id",
    PO_FINANCE_SEND_DATE: "po_finance_send_date",
    PO_FINANCE_REMARKS: "po_finance_remarks"
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


const OUTLET_PO_LOGS = {
  NAME: "outlet_po_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    OLDDATA: "oldata",
    NEWDATA: "newdata",
    USER_ID: "user_id",
    USER_NAME: "user_name",
    PO_NO: "po_no",
    PO_DATE: "po_date",
    CREATED_AT: "created_at"

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

const MAIN_CATEGORY = {
  NAME: "main_category",
  COLUMNS: {
    ID: "id",
    CATEGORY_NAME: "category_name",
    CATEGORY_IMAGE: "category_image",
    COMPANY_ID: "company_id",
    IS_INSERTED: "is_inserted",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    IS_ACTIVE: "is_active"
  }
};


const OUTLET_PO_DETAILS_TEMP = {
  NAME: "outlet_po_details_temp",
  COLUMNS: {
    ID: "id",
    OUTLET_PO_MASTER_ID: "outlet_po_master_id",
    OUTLET_ID: "outlet_id",
    OUTLET_NAME: "outlet_name",
    FINANCIAL_YEAR: "financial_year",
    PO_NO: "po_no",
    PO_DATE: "po_date",
    PROD_CODE: "prod_code",
    PROD_ID: "prod_id",
    PROD_NAME: "prod_name",
    SUPPLIER_ID: "supplier_id",
    CATEGORY_ID: "category_id",
    CATEGORY_NAME: "category_name",
    SALES_QUANTITY: "sales_quantity",
    STK_HOLD: "stk_hold",
    BALANCE: "balance",
    PHY_QTY: "phy_qty",
    MRP: "mrp",
    CP: "cp",
    GST: "gst",
    IGST: "igst",
    CGST: "cgst",
    SGST: "sgst",
    GST_AMOUNT: "gst_amount",
    RATE: "rate",
    QUANTITY: "quantity",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    TYPE: "type",
    MBQ: "mbq",
    MBQDAYS: "mbqdays",
    PACK_QTY: "pack_qty",
    SYS_QTY: "sys_qty",
    SALES_QTY: "sales_qty",
    REQ_QTY: "req_qty",
    ORD_QTY: "ord_qty",
    SUGG_QTY: "sugg_qty",
    MIN_MBQ: "min_mbq",
    T_QTY: "t_qty",
    SALES_DAYS: "sales_days",
    STOCK_DAYS: "stock_days",
    LANDING_RATE: "landing_rate",
    FIXEDMARGIN: "fixedmargin",
    VENDORDISCOUNTTYPE: "vendordiscounttype",
    VENDORDISCOUNTVALUE: "vendordiscountvalue",
    AVERAGE_QTY: "average_qty",
    STOCK_BALANCE: "stock_balance",
    TOTAL_BALANCE: "total_balance",
    FINAL_MBQ: "final_mbq",
    BRAND_COMPANY_ID: "brand_company_id"
  }
};



const OUTLET_PO_MASTER_TEMP = {
  NAME: "outlet_po_master_temp",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    PO_NO: "po_no",
    PO_DATE: "po_date",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    APPROVAL: "approval",
    IS_APPROVED_BY: "is_approved_by",
    UN_APPROVAL_COMMENTS: "un_approval_comments",
    TOTAL_ITEMS: "total_items",
    TOTAL_ORDER_QTY: "total_order_qty",
    SUB_TOTAL_AMT: "sub_total_amt",
    TOTAL_GST_AMT: "total_gst_amt",
    TOTAL_IGST_AMT: "total_igst_amt",
    TOTAL_CESS_AMT: "total_cess_amt",
    ROFF: "roff",
    GRAND_TOTAL_AMT: "grand_total_amt",
    EXPIRY_DATE: "expiry_date",
    EXPIRED: "expired",
    COMPANY_ID: "company_id",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    TYPE: "type",
    SET_QTY_FLAG: "set_qty_flag",
    BRAND_COMPANY_ID: "brand_company_id"
  }
};

const KPN_FARM_FRESH_USER_EMAIL = {
  NAME: "kpn_farm_fresh_user_email",
  COLUMNS: {
    ID: "id",
    USER_EMAIL: "user_mail",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};



const PO_FINANCE_SEND_BACK_LOGS = {
  NAME: "po_finance_send_back_logs",
  COLUMNS: {
    ID: "id",
    PO_NO: "po_no",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    PO_SENDER_ID: "po_sender_id",
    PO_RECEIVER_ID: "po_receiver_id",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
module.exports = {
  OUTLET_PO_DETAILS,
  OUTLET_PO_MASTER,
  SUPPLIER_OUTLET_MAPPING,
  OUTLET_PO_LOGS,
  VENDORS_MAPPING,
  POSETTINGS,
  MAIN_CATEGORY,
  OUTLET_PO_DETAILS_TEMP,
  OUTLET_PO_MASTER_TEMP,
  OUTLET_SUPPLIER_ORDERDAYS,
  KPN_FARM_FRESH_USER_EMAIL,
  PO_FINANCE_SEND_BACK_LOGS,
  VENDOR_MAIL
};
