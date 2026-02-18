const OUTLET_PURCHASE_MASTER = {
  NAME: "outlet_purchase_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
    MEMO_NO: "memo_no",
    MEMO_DATE: "memo_date",
    COMPANY_ID: "company_id",
    WAREHOUSE_ID: "wh_id",
    SUPPLIER_ID: "supplier_id",
    OUTLET_ID: "outlet_id",
    INVOICE_NO: "invoice_no",
    INVOICE_DATE: "invoice_date",
    CUSTOMER_TYPE: "customer_type",
    PONO: "pono",
    PODATE: "podate",
    STATUS: "status",
    GRAND_TOTAL_AMT: "grand_total_amt",
    SUB_TOTAL_AMT: "sub_total_amt",
    MEMO_INVOICE_AMT: "memo_invoice_amt",
    TOTAL_RETURN_AMT: "total_return_amt",
    TOTAL_DEBIT_NOTE_AMOUNT: "total_debit_note_amount",
    TOTAL_GST_AMT: "total_gst_amt",
    TOTAL_IGST_AMT: "total_igst_amt",
    TOTAL_CESS_AMT: "total_cess_amt",
    TOTAL_ORDER_QTY: "total_order_qty",
    TOTAL_RECEIVED_QTY: "total_received_qty",
    TOTAL_RETURN_QTY: "total_return_qty",
    TOTAL_ITEMS: "total_items",
    DISCOUNT: "discount",
    ROFF: "roff",
    FRIGHT_CHARGES: "fright_charges",
    OTHER_CHARGES: "other_charges",
    ADVANCE: "advance",
    TCS: "tcs",
    PRODUCT_TYPE: "product_type",
    REMARK: "remark",
    RETURN_REMARK: "return_remark",
    PURCHASE: "purchase",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    PURCHASE_SYNC: "purchase_sync",
    DOWN_TIME: "down_time",
    OUTLET_GRN_NO: "outlet_grn_no"
  }
};


const OUTLET_PURCHASE_DETAILS = {
  NAME: "outlet_purchase_details",
  COLUMNS: {
    ID: "id",
    OUTLET_PURCHASE_MST_ID: "outlet_purchase_mst_id",

    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
    PO_NO: "po_no",

    COMPANY_ID: "company_id",
    SUPPLIER_ID: "supplier_id",
    OUTLET_ID: "outlet_id",

    PRODUCT_ID: "prod_id",
    PRODUCT_CODE: "prod_code",

    CATEGORY_ID: "cat_id",
    SUB_CATEGORY_ID: "sub_cat_id",
    HEAD_ID: "head_id",
    TYPE_DESIGN_ID: "type_design_id",

    UOM_ID: "uom_id",
    BARCODE: "barcode",
    HSN_CODE: "hsn_code",

    QTY: "qty",
    FREE_QTY: "free_qty",
    RETURN_QTY: "return_qty",
    TEMP_RECEIVED_QTY: "temp_rec_qty",
    TEMP_GRN_RETURN_QTY: "temp_grn_return_qty",

    MRP: "mrp",
    SALE_RATE: "sale_rate",
    PURCHASE_RATE: "purchase_rate",
    ACCEPTED_MARGIN: "accepted_margin",

    DISCOUNT: "discount",
    DISCOUNT_AMOUNT: "discount_amount",

    GST: "gst",
    GST_AMOUNT: "gst_amount",
    IGST: "igst",
    IGST_AMOUNT: "igst_amount",
    SGST: "sgst",
    CGST: "cgst",

    CESS: "cess",
    CESS_AMOUNT: "cess_amount",

    AMOUNT: "amount",
    RETURN_AMOUNT: "return_amount",
    SELF_LIFE_EXPIRY_DAYS: "self_life_expiry_days",

    PURCHASE: "purchase",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    IS_ACTIVE: "is_actvie",

    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",

    PURCHASE_SYNC: "purchase_sync",
    DOWN_TIME: "down_time",

    GIVEN_MARGIN: "given_margin",
    SALES_MARGIN: "sales_margin"
  }
};


const OUTLET_PURCHASE_BATCH_DETAILS = {
  NAME: "outlet_purchase_batch_details",
  COLUMNS: {
    ID: "id",
    OUTLET_PURCHASE_MASTER_ID: "outlet_purchase_master_id",
    PRODUCT_ID: "product_id",
    PRODUCT_CODE: "product_code",
    BATCH_NO: "batch_no",
    QTY: "qty",
    MRP: "mrp",
    SELF_LIFE_EXPIRY_DAYS: "self_life_expiry_days",
    RETURN_QTY: "return_qty",
    COMPANY_ID: "company_id",
    MANUFACTURE_DATE: "manufacture_date",
    EXPIRY_ID: "expiry_id",
    EXPIRY_VALUE: "expiry_value",
    EXPIRY_DATE: "expiry_date"
  }
};

const OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS = {
  NAME: "outlet_purchase_grn_free_item_details",
  COLUMNS: {
    ID: "id",
    OUTLET_PURCHASE_GRN_MST_ID: "outlet_purchase_grn_mst_id",
    PRODUCT_ID: "product_id",
    PRODUCT_CODE: "product_code",
    FREE_PRODUCT_CODE: "free_product_code",
    FREE_PRODUCT_NAME: "free_product_name",
    QTY: "qty",
    MRP: "mrp"
  }
};

const OUTLET_PARTY_LEDGER = {
  NAME: "outlet_party_ledger",
  COLUMNS: {
    ID: "id",
    PARTY_LEDGER_ID: "pl_id",
    OUTLET_ID: "outlet_id",
    PARTY_LEDGER_DETAIL_ID: "pl_did",
    LEDGER_DATE: "pl_date",
    LEDGER_TYPE: "pl_type",
    LEDGER_NUMBER: "pl_no",
    LEDGER_MODE: "pl_mode",
    CHEQUE_NUMBER: "pl_chequeno",
    CHEQUE_DATE: "pl_cdate",
    CREDIT_AMOUNT: "pl_credit",
    DEBIT_AMOUNT: "pl_debit",
    REMARKS: "pl_remarks",
    PAYMENT_TYPE: "pl_pttyp",
    COMPANY_ID: "pl_comid",
    PL_WH_ID: "pl_wh_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const OUTLET_PURCHASE_RETURN_MASTER = {
  NAME: "outlet_purchase_return_master",

  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",

    DOC_NO: "doc_no",
    DOC_DATE: "doc_date",

    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",

    INVOICE_NO: "invoice_no",
    INVOICE_DATE: "invoice_date",

    PO_NO: "po_no",
    PO_DATE: "po_date",

    MEMO_NO: "memo_no",
    MEMO_DATE: "memo_date",

    // ✅ NEW (was missing)
    PURCHASE_NO: "purchase_no",
    PURCHASE_DATE: "purchase_date",

    OUTLET_PURCHASE_NO: "outlet_purchase_no",
    OUTLET_PURCHASE_RETURN_NO: "outlet_purchase_return_no",

    WH_ID: "wh_id",
    RETURN_TYPE: "return_type",

    ROFF: "roff",
    GRAND_TOTAL_AMT: "grand_total_amt",
    SUB_TOTAL_AMT: "sub_total_amt",

    TOTAL_GST_AMT: "total_gst_amt",
    TOTAL_IGST_AMT: "total_igst_amt",
    TOTAL_CESS_AMT: "total_cess_amt",

    TOTAL_ITEMS: "total_items",
    DISCOUNT: "discount",

    REMARK: "remark",

    // ✅ E-Invoice / Verification
    EINVOICE_NO: "einvoice_no",           // NEW
    VERIFY: "verify",               // NEW
    VERIFY_USER_ID: "verify_user_id",// NEW

    // ✅ E-Way Bill
    EWAY: "eway",
    EWAY_NO: "eway_no",             // NEW
    EWAY_DATE: "eway_date",
    EWAY_VALID_DATE: "eway_valid_date",
    EWAY_INVOICE_PATH: "eway_invoice_path", // NEW
    EWAY_PATH: "eway_path",

    // ✅ GST / IRN
    AKNO: "akno",
    AK_DATE: "ak_date",
    IRNNO: "irnno",

    EFFECT_DATE: "effect_date",

    IS_ACTIVE: "is_active",

    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",

    RETURN_SYNC: "return_sync",
    DOWN_TIME: "down_time"
  }
};


const OUTLET_PURCHASE_RETURN_DETAILS = {
  NAME: "outlet_purchase_return_details",

  COLUMNS: {
    ID: "id",
    OUTLET_PURCHASE_RETURN_MST_ID: "outlet_purchase_return_mst_id",

    FINANCIAL_YEAR: "financial_year",
    DOC_NO: "doc_no",
    DOC_DATE: "doc_date",

    PO_NO: "po_no",
    PO_DATE: "po_date",

    MEMO_NO: "memo_no",
    MEMO_DATE: "memo_date",

    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",
    WH_ID: "wh_id",

    PRODUCT_ID: "prodid",
    PRODUCT_CODE: "pro_code",

    BATCH_NO: "batch_no",
    EXPIRY_DATE: "expiry_date",

    ACCEPTED_QTY: "accepted_qty",
    ACCEPTED_FREE_QTY: "accepted_free_qty",

    RETURN_QTY: "return_qty",
    RETURN_FREE_QTY: "return_free_qty",

    DISCOUNT_PERCENT: "dis_per",
    DISCOUNT_AMOUNT: "dis_amt",

    RATE: "rate",
    AMOUNT: "amount",
    MRP: "mrp",

    GST: "gst",
    GST_AMOUNT: "gst_amount",

    IGST: "igst",
    IGST_AMOUNT: "igst_amount",

    CGST: "cgst",
    SGST: "sgst",

    CESS: "cess",
    CESS_AMOUNT: "cess_amt",

    REASON: "reason",

    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",

    RETURN_SYNC: "return_sync",
    DOWN_TIME: "down_time"
  }
};

const OUTLET_DEBIT_NOTE_MASTER = {
  NAME: "outlet_debite_note_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOC_NO: "doc_no",
    DOC_DATE: "doc_date",
    PURCHASE_DOC_NO: "purchase_doc_no",
    PURCHASE_DOC_DATE: "purchase_doc_date",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",
    TOTAL_INVOICE_AMOUNT: "total_invoice_amount",
    PURCHASE_TOTAL_AMT: "purchase_total_amt",
    TOTAL_DEBIT_NOTE_AMOUNT: "total_debit_note_amount",
    REMARK: "remark",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    OUTLET_DEBIT_NOTE_NO: "outlet_debit_note_no",
    DEBIT_NOTE_SYNC: "debit_note_sync",
    DOWN_TIME: "down_time"
  }
};

const OUTLET_DEBIT_NOTE_DETAILS = {
  NAME: "outlet_debite_note_details",
  COLUMNS: {
    ID: "id",
    OUTLET_DEBIT_NOTE_MST_ID: "outlet_debit_note_mst_id",
    FINANCIAL_YEAR: "financial_year",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",
    PRODUCT_ID: "product_id",
    PRODUCT_CODE: "product_code",
    QTY: "qty",
    MRP: "mrp",
    RATE: "rate",
    AMOUNT: "amount",
    REASON: "reason",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    DEBIT_NOTE_SYNC: "debit_note_sync",
    DOWN_TIME: "down_time"
  }
};

const STORE_PO_MASTER = {
  NAME: "stores_po_master",
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
    TOTAL_IGST_AMT: "total_igst_amt",
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
    PURCHASE_ORDER_TYPE: "purchase_order_type",
    WH_ID: "wh_id",
    IS_APPROVED_BY: "is_approved_by",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    OUTLET_ID: "outlet_id"
  }
};

const STORE_PO_DETAILS = {
  NAME: "stores_po_details",
  COLUMNS: {
    ID: "id",
    PURCHASE_ORDER_MST_ID: "purchase_order_mst_id",
    FINANCIAL_YEAR: "financial_year",
    PONO: "pono",
    PODATE: "podate",
    BALANCE: "balance",
    PROD_ID: "prod_id",
    CAT_ID: "cat_id",
    SUB_CAT_ID: "sub_cat_id",
    HEAD_ID: "head_id",
    TYPE_DESIGN_ID: "type_design_id",
    UOM_ID: "uom_id",
    BARCODE: "barcode",
    MRP: "mrp",
    PURCHASE_RATE: "purchase_rate",
    COST_PRICE: "cost_price",
    QTY: "qty",
    ORDER_QTY: "order_qty",
    AMOUNT: "amount",
    COMPANY_ID: "company_id",
    SUPPLIER_ID: "supplier_id",
    RECEIVED_QTY: "recived_qty",
    RECEIVED_GRN_QTY: "recived_grn_qty",  // Added missing column
    LOOSE_QTY: "loose_qty",
    EXPIRED: "expired",
    IS_GRN_COMPLETE: "is_grn_complete",
    GST_AMOUNT: "gst_amount",
    IGST: "igst",
    GST: "gst",
    CGST: "cgst",
    SGST: "sgst",
    CESS: "cess",
    CESS_AMT: "cess_amt",
    IGST_AMOUNT: "igst_amount",
    CASE_QTY: "case_qty",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    OUTLET_ID: "outlet_id",
    PROD_CODE: "prod_code"
  }
};

const PURCHASE_ORDER_SETTING = {
  NAME: "purchase_order_setting",
  COLUMNS: {
    ID: "id",
    PURCHASE_ORDER: "purchase_order"
  }
};

const STORE_PURCHASE_RETURN_DETAILS = {
  NAME: "store_purchase_return_details",
  COLUMNS: {
    ID: "id",
    PURMST_ID: "purchase_return_mst_id",
    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
    OUTLET_ID: "outlet_id",
    PRODID: "prodid",
    PRO_CODE: "pro_code",
    BATCH_NO: "batch_no",
    EXPIRY_DATE: "expiry_date",
    ACCEPTED_QTY: "accepted_qty",
    ACCEPTED_FREE_QTY: "accepted_free_qty",
    RETURN_QTY: "return_qty",
    RETURN_FREE_QTY: "return_free_qty",
    TEMP_RETURN_QTY: "temp_return_qty",
    TEMP_RETURN_FREE_QTY: "temp_return_free_qty",
    DIS_PER: "dis_per",
    DIS_AMT: "dis_amt",
    RATE: "rate",
    AMOUNT: "amount",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",
    MRP: "mrp",
    GST: "gst",
    IGST: "igst",
    GST_AMOUNT: "gst_amount",
    IGST_AMOUNT: "igst_amount",
    CGST: "cgst",
    SGST: "sgst",
    CESS: "cess",
    CESS_AMT: "cess_amt",
    REASON: "reason",
    MOBILE_RETURN_ID: "mobile_return_id",
    GRN_RETURN_QTY: "grn_return_qty",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const STORE_PURCHASE_RETURN_MASTER = {
  NAME: "store_purchase_return_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
    OUTLET_ID: "outlet_id",
    SUPPLIER_ID: "supplier_id",
    TOTAL_AMOUNT: "total_amount",
    DISCOUNT: "discount",
    GRAND_TOTAL: "grand_total",
    TEMP_GRAND_TOTAL: "temp_grand_total",
    PURCHASE_MASTER_ID: "purchase_master_id",
    INVOICE_NO: "invoice_no",
    INVOICE_DATE: "invoice_date",
    ROFF: "roff",
    COMPANY_ID: "company_id",
    WH_ID: "wh_id",
    RETURN_TYPE: "return_type",
    TOTAL_CESS_AMT: "total_cess_amt",
    TOTAL_GST_AMT: "total_gst_amt",
    TOTAL_IGST_AMT: "total_igst_amt",
    REMARK: "remark",
    TDS_PERCENTAGE: "tds_percentage",
    TDS_AMOUNT: "tds_amount",
    EWAY: "eway",
    EWAY_TYPE: "eway_type",
    EWAY_DATE: "eway_date",
    EWAY_VALID_DATE: "eway_valid_date",
    EWAY_PATH: "eway_path",
    EINVOICE: "einvoice",
    AKNO: "akno",
    AK_DATE: "ak_date",
    IRNNO: "irnno",
    EFFECT_DATE: "effect_date",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const REASON = {
  NAME: "reason",
  COLUMNS: {
    ID: "id",
    REASON_NAME: "reason_name",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};



module.exports = {
  OUTLET_PURCHASE_MASTER,
  OUTLET_PURCHASE_DETAILS,
  OUTLET_PURCHASE_BATCH_DETAILS,
  OUTLET_PURCHASE_GRN_FREE_ITEM_DETAILS,
  OUTLET_PARTY_LEDGER,
  OUTLET_PURCHASE_RETURN_MASTER,
  OUTLET_PURCHASE_RETURN_DETAILS,
  OUTLET_DEBIT_NOTE_DETAILS,
  OUTLET_DEBIT_NOTE_MASTER,
  STORE_PO_MASTER,
  STORE_PO_DETAILS,
  PURCHASE_ORDER_SETTING,
  STORE_PURCHASE_RETURN_DETAILS,
  STORE_PURCHASE_RETURN_MASTER,
  REASON
};



