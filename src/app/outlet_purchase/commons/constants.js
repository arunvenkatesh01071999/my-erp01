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
    TDS_PERCENTAGE:"tds_percentage",
    TOTAL_TDS_AMOUNT:"total_tds_amount",
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

const SETTING = {
  NAME: "setting",
  COLUMNS: {
    ID: "id",

    ST_PO_EXP_DAYS: "st_po_exp_days",
    ST_ALLOCT_EXTRA_QTY: "st_alloct_extra_qty",
    ST_DSPTH_BRND_USR: "st_dspth_brnd_usr",
    ST_G_PICK_LOC_ITEM: "st_g_pick_loc_item",
    ST_MALAYSIAN: "st_malaysian",

    ST_SALES_PRNT: "st_sales_prnt",
    ST_TERM1: "st_term1",
    ST_TERM2: "st_term2",
    ST_TERM3: "st_term3",
    ST_TERM4: "st_term4",
    ST_TERM5: "st_term5",

    ST_PUR_PRNT: "st_pur_prnt",
    ST_COM_ID: "st_com_id",
    ST_SALES_START: "st_sales_start",
    ST_PUR_START: "st_pur_start",
    ST_PRINT_PRV: "st_print_prv",

    TS_EMAIL1: "ts_email1",
    TS_EMAIL2: "ts_email2",
    TS_EMAIL3: "ts_email3",
    TS_CHK1: "ts_chk1",
    TS_CHK2: "ts_chk2",
    TS_CHK3: "ts_chk3",

    ST_SUPP_RATE: "st_supp_rate",
    ST_CUST_RATE: "st_cust_rate",
    ST_OPN_CASH: "st_opn_cash",
    ST_CASH_BILL_NAME: "st_cash_bill_name",
    ST_CASH_BILL_VAT: "st_cash_bill_vat",

    ST_ONLY_QTY_EDIT: "st_only_qty_edit",
    ST_FOOTER1: "st_footer1",
    ST_FOOTER2: "st_footer2",
    ST_PARENT_STOCK: "st_parent_stock",
    ST_PUR_TYPE: "st_pur_type",
    ST_DAY_EDIT: "st_day_edit",

    ST_CUST_NAME: "st_cust_name",
    ST_MBQ_DAYS: "st_mbq_days",
    ST_PUR_CAPTION: "st_pur_caption",
    ST_SALES_PREFIX: "st_sales_prefix",
    ST_SALES_DC: "st_sales_dc",
    ST_TAMIL_PRINT: "st_tamil_print",

    ST_OUTLET_RATE: "st_outlet_rate",
    ST_SALES_DAYS: "st_sales_days",
    ST_STOCK_DAYS: "st_stock_days",
    ST_MRP_PER: "st_mrp_per",

    ST_STORE_MBQ_PER: "st_store_mbq_per",
    ST_FV_SALES_START: "st_fv_sales_start",
    ST_FV_PUR_START: "st_fv_pur_start",

    ST_EXE_SHARE: "st_exe_share",
    ST_AUTO_EXPORT: "st_auto_export",
    ST_FV_MULTI_DC_SAL: "st_fv_multi_dc_sal",
    ST_EXPIRY_EDIT: "st_expiry_edit",
    ST_SOH_MBQ_PRINT: "st_soh_mbq_print",
    ST_CLOSING_STOCK_VIEW: "st_closing_stock_view",

    ST_MBQ_REGULAR_TYPE: "st_mbq_regular_type",
    ST_WEB_PRD: "st_web_prd",
    ST_MEMO_GRN: "st_memo_grn",
    ST_PO_TERMS: "st_po_terms",

    ST_TRAY_SYNC: "st_tray_sync",
    ST_WH_CASE_QTY_PER: "st_wh_case_qty_per",
    ST_ALLOCT_EXCESS_QTY: "st_alloct_excess_qty",
    ST_FNV_EXTRA_QTY_PER: "st_fnv_extra_qty_per",
    ST_FNV_ALLOCAT_ALERT: "st_fnv_allocat_alert",

    ST_TRAY_ENT_SALES_DESPATCH: "st_tray_ent_sales_despatch",
    ST_TCS_PER: "st_tcs_per",
    ST_TCS_TURN_OVER: "st_tcs_turn_over",
    ST_USER_ROLE: "st_user_role",

    ST_DAY_CLS_TIME: "st_day_cls_time",
    ST_OUTLET_STOCK_MAIL_TIME: "st_outlet_stock_mail_time",

    ST_FNV_DAY_PICK_OUT: "st_fnv_day_pick_out",
    ST_MANUAL_PO_ITEM: "st_manual_po_item",
    ST_BILL_VERIFY: "st_bill_verify",
    ST_FNV_DC_PRINTER: "st_fnv_dc_printer",

    ST_FV_GATE_PASS: "st_fv_gate_pass",
    ST_FV_PO_MAND: "st_fv_po_mand",
    ST_GP_SHIFT: "st_gp_shift",
    ST_GRN_EDIT: "st_grn_edit",
    ST_NO_PO_AUTO_PICK: "st_no_po_auto_pick",

    ST_PUTAWAY_TIME: "st_putaway_time",
    ST_PUTAWAY_CS_TIME: "st_putaway_cs_time",
    ST_FNV_ALLOCT_TIME_BASED: "st_fnv_alloct_time_based",

    MALAYSIA_MRP: "malaysia_mrp",
    MALAYSIA_GST: "malaysia_gst",

    ST_AUTO_SHIFT_START: "st_auto_shift_start",
    ST_FV_TRANSCTION_MENU: "st_fv_transction_menu",
    ST_KITCHEN_MENU: "st_kitchen_menu",
    ST_STORE_MENU: "st_store_menu",

    ST_GS_START: "st_gs_start",
    ST_GT_START: "st_gt_start",
    ST_FS_START: "st_fs_start",
    ST_FT_START: "st_ft_start",

    ST_GSSR_START: "st_gssr_start",
    ST_GTSR_START: "st_gtsr_start",
    ST_FVSR_START: "st_fvsr_start",
    ST_FVPR_START: "st_fvpr_start",

    ST_PR_START: "st_pr_start",
    ST_WST_START: "st_wst_start",
    ST_FVWST_START: "st_fvwst_start",

    ST_FV_PO_DEVIAT: "st_fv_po_deviat",
    ST_LOC_RTV: "st_loc_rtv",
    ST_STORE_CASE_ALLOCATE: "st_store_case_allocate",
    ST_FNV_SEP_DAYCLOSE: "st_fnv_sep_dayclose",
    ST_FMCG_PICK_MRP: "st_fmcg_pick_mrp",

    ST_PUTAWAY_PER: "st_putaway_per"
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
  SETTING
};
