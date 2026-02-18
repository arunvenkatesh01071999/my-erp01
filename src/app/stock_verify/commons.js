const STOCKMISSINGMST = {
  NAME: "stock_missing_master",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    PARTYCODE: "partycode",
    AMOUNT: "amount",
    SUBTOTAL_AMOUNT: "subtotal_amount",
    GST_PER: "gst_per",
    GST_AMT: "gst_amt",
    CESS_PER: "cess_per",
    CESS_AMT: "cess_amt",
    ROFF: "roff",
    MODE: "mode",
    OUTSTANDING: "outstanding",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const STOCKMISSINGMSTDETAILS = {
  NAME: "stock_missing_details",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    STOCK_MISSING_MST_ID: "stock_missing_mst_id",
    PRODID: "prodid",
    DIS_PER: "dis_per",
    DIS_AMT: "dis_amt",
    MRP: "mrp",
    RATE: "rate",
    QTY: "qty",
    GST_PER: "gst_per",
    GST_AMT: "gst_amt",
    CESS_PER: "cess_per",
    CESS_AMT: "cess_amt",
    BARCODE: "barcode",
    BARCODE_TO: "barcode_to",
    COMPANY_ID: "company_id",
    HEAD_ID: "head_id",
    TYPE_ID: "type_id",
    SUBCAT_ID: "subcat_id",
    CAT_ID: "cat_id",
    UOM_ID: "uom_id",
    IGST_PER: "igst_per",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const STOCKLEDGER = {
  NAME: "stockledger",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    PROD_ID: "prod_id",
    PARCHASE_QTY: "purchase_qty",
    SALE_QTY: "sale_qty",
    PURCHASE_RETURN_QTY: "purchase_return_qty",
    WASTAGE_QTY: "wastage_qty",
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
    UPDATED_BY: "updated_by"
  }
};

const OUTLETSTOCKLEDGER = {
  NAME: "outlet_stock_ledger",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    PRODID: "prodid",
    OUTLETID: "outletid",
    PARCHASE_QTY: "purchase_qty",
    SALE_QTY: "sale_qty",
    PURCHASE_RETURN_QTY: "purchase_return_qty",
    WASTAGE_QTY: "wastage_qty",
    ADJUST_QTY: "adjust_qty",
    FREE_QTY: "free_qty",
    SALES_IN_QTY: "sales_in_qty",
    RECEIVED_IN_QTY: "received_in_qty",
    SALES_RETURN_QTY: "sales_return_qty",
    TR_IN_QTY: "tr_in_qty",
    TR_OUT_QTY: "tr_out_qty",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const STOCK_VERIFY_SETTING = {
  NAME: "stock_verify_setting",
  COLUMNS: {
    ID: "id",
    IS_VERIFY: "is_verify"
  }
};

const STOCK_SCAN = {
  NAME: "stock_scaned",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    BARCODE: "barcode",
    PRODID: "prodid",
    PRO_CODE: "pro_code",
    DESCRIPTION: "description",
    MRP: "mrp",
    GST_PER: "gst_per",
    RATE: "rate",
    DIS_PER: "dis_per",
    QTY: "qty",
    GST_AMT: "gst_amt",
    AMOUNT: "amount",
    SALES_DETAILS_ID: "sales_details_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    OUTLET_ID: "outlet_id"
  }
};

module.exports = {
  STOCKMISSINGMST,
  STOCKMISSINGMSTDETAILS,
  STOCKLEDGER,
  OUTLETSTOCKLEDGER,
  STOCK_VERIFY_SETTING,
  STOCK_SCAN
};