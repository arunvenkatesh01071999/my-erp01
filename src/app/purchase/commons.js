const PURCHASE_FMCG_MASTER = {
  NAME: "purchase_fmcg_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOC_NO: "docno",
    DOC_DATE: "docdate",
    SUPPLIER_ID: "supplier_id",
    TOTAL_AMOUNT: "sub_total_amount",
    DISCOUNT: "discount",
    GRAND_TOTAL: "grand_total",
    TEMP_GRAND_TOTAL: "temp_grand_total",
    INVOICE_NO: "invoice_no",
    INVOICE_DATE: "invoice_date",
    PAID: "paid",
    ROUND_OFF: "roff",
    STATUS: "status",
    RETURN_AMOUNT: "total_return_amount",
    COMPANY_ID: "company_id",
    OTHER_CHARGES: "other_charges",
    GST: "total_gst_amt",
    IGST: "total_igst_amt",
    CESS_AMOUNT: "total_cess_amt",
    ADVANCE: "advance",
    REMARK: "remark",
    LESS_AMOUNT: "less_amt",
    PRODUCT_TYPE: "product_type",
    TCS: "tcs",
    DC_NO: "dc_no",
    CLOSING_STOCK: "closing_stock",
    OPENING_STOCK: "opening_stock",
    PURCHASE: "purchase",
    PURCHASE_RETURN: "purchase_return",
    SALES: "sales",
    SALES_RETURN: "sales_return",
    DEBIT_NOTE: "debit_note",
    PROFIT: "profit",
    PERCENTAGE: "percentage",
    AVG_AGREED_MARGIN: "avg_agreed_margin",
    AVG_FILL_RATE: "avg_fil_rate",
    TDS_PERCENTAGE: "tds_percentage",
    TDS_AMOUNT: "tds_amount",
    REASON_DEBIT_NOTE: "reason_debite_note",
    REASON_DEBIT_NOTE_AMOUNT: "reason_debite_note_amount",
    DEBIT_NOTE_AMOUNT: "debite_note_amount",
    FREIGHT_CHARGES: "freight_charges",
    WAREHOUSE_ID: "wh_id",
    CUSTOMER_TYPE: "customer_type",
    OUTSTANDING_AMT: "outstanding_amt",
    IS_PAID: "is_paid",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const PURCHASE_FMCG_DETAILS = {
  NAME: "purchase_fmcg_details",
  COLUMNS: {
    ID: "id",
    PURCHASE_MASTER_ID: "purchase_master_id",
    FINANCIAL_YEAR: "financial_year",
    DOC_NO: "docno",
    DOC_DATE: "docdate",
    PRODUCT_ID: "prodid",
    PRODUCT_CODE: "pro_code",
    HEAD_ID: "head_id",
    TYPE_ID: "type_id",
    SUB_CATEGORY_ID: "subcat_id",
    CATEGORY_ID: "cat_id",
    UOM_ID: "uom_id",
    QUANTITY: "qty",
    FREE_QUANTITY: "free_qty",
    DISCOUNT_PERCENTAGE: "dis_per",
    DISCOUNT_AMOUNT: "dis_amt",
    VAT: "vat",
    VAT_AMOUNT: "vat_amt",
    RATE: "rate",
    AMOUNT: "amount",
    SUPPLIER_ID: "supplier_id",
    COMPANY_ID: "company_id",
    WAREHOUSE_ID: "wh_id",
    PURCHASE_ORDER_NO: "po_no",
    ACCEPTED_MARGIN: "accepted_margin",
    SALE_RATE: "sale_rate",
    MRP: "mrp",
    GST: "gst",
    IGST: "igst",
    GST_AMOUNT: "gst_amount",
    IGST_AMOUNT: "igst_amount",
    CGST: "cgst",
    SGST: "sgst",
    CESS: "cess",
    CESS_AMOUNT: "cess_amt",
    PURCHASE_ORDER_QUANTITY: "po_qty",
    PACK_FLAG: "pack_flag",
    PACK_QUANTITY: "pack_qty",
    WAREHOUSE_MARGIN: "warehouse_margin",
    SALES_MARGIN: "sales_margin",
    REASON_DEBIT_NOTE_AMOUNT: "reason_debit_note_amt",
    REASON_DEBIT_NOTE: "reason_debite_note",
    RETURN_QUANTITY: "return_qty",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const PURCHASE_MST_PONUM = {
  NAME: "purchase_master_ponumbers",
  COLUMNS: {
    ID: "id",
    PURMST_ID: "purmst_id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    PONO: "pono",
    PODATE: "podate",
    WH_ID: "wh_id",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const PURCHASE_TRAY_DETAILS = {
  NAME: "purchase_tray_details",
  COLUMNS: {
    ID: "id",
    PURCHASE_MASTER_ID: "purchase_master_id",
    DOCDATE: "docdate",
    TRAY_ID: "tray_id",
    TRAY_COUNT: "tray_count"
  }
};


const PARTY_LEDGER = {
  NAME: "party_ledger",
  COLUMNS: {
    ID: "id",
    PARTY_LEDGER_ID: "pl_id",
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
    PL_WH_ID: "pl_wh_id",
    PAYMENT_TYPE: "pl_pttyp",
    COMPANY_ID: "pl_comid",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const STOCKLEDGER = {
  NAME: "stockledger",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    PROD_ID: "prod_id",
    PUR_QTY: "purchase_qty",
    SALE_QTY: "sale_qty",
    PUR_RET_QTY: "purchase_return_qty",
    WAS_QTY: "wastage_qty",
    ADJUST_QTY: "adjust_qty",
    FREE_QTY: "free_qty",
    SALES_IN_QTY: "sales_in_qty",
    SALES_RETURN_QTY: "sales_return_qty",
    TR_IN_QTY: "tr_in_qty",
    TR_OUT_QTY: "tr_out_qty",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    WH_ID: "wh_id"
  }
};


const PURCHASE_FMCG_RETURN_MASTER = {
  NAME: "purchase_fmcg_retrun_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
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


const PURCHASE_FMCG_RETURN_DETAILS = {
  NAME: "purchase_fmcg_return_details",
  COLUMNS: {
    ID: "id",
    PURMST_ID: "purchase_return_mst_id",
    FINANCIAL_YEAR: "financial_year",
    DOCNO: "docno",
    DOCDATE: "docdate",
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


const PURCHASE_MBQ_DETAILS = {
  NAME: "purchase_mbq_details",
  COLUMNS: {
    ID: "id",
    PURCHASE_ORDER_ID: "purchase_order_id",
    MBQ_DATE: "mbq_date",
    SUPPLIER_ID: "supplier_id",
    LOCATION_ID: "location_id",
    PRO_CODE: "pro_code",
    PO_QTY: "po_qty",
    GRN_NO: "grn_no",
    TODATE: "todate",
    GRN_QTY: "grn_qty"
  }
};


module.exports = {
  PURCHASE_FMCG_MASTER,
  PURCHASE_MST_PONUM,
  PURCHASE_FMCG_DETAILS,
  PARTY_LEDGER,
  STOCKLEDGER,
  PURCHASE_FMCG_RETURN_MASTER,
  PURCHASE_FMCG_RETURN_DETAILS,
  PURCHASE_MBQ_DETAILS,
  PURCHASE_TRAY_DETAILS,
  REASON
};
