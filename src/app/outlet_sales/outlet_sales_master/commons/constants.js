const OUTLETSALESMASTER = {
  NAME: "outlet_sales_master",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",//
    TRANSACTION_ID: "transaction_id",
    TRANSACTION_PROVIDER: "transaction_provider",
    TRANSACTION_TYPE: "transaction_type",
    DOCDATE: "docdate",//
    SALESMAN_ID: "salesman_id",
    OUTLETID: "outletid",// code
    AMOUNT: "amount",//
    SUBTOTAL_AMOUNT: "subtotal_amount",
    GST_PER: "gst_per",
    GST_AMT: "gst_amt",
    CESS_PER: "cess_per",
    CESS_AMT: "cess_amt",
    ROFF: "roff",
    IS_CREDIT: "is_credit",
    OUTSTANDING: "outstanding",
    MODE: "mode",//
    COMPANY_ID: "company_id",
    MOBILE: "mobile",
    PARTY_NAME: "party_name",
    ADDRESS: "address",
    GET_IN: "gst_in",
    LOYALTY_EARNED: "loyalty_earned",//
    LOYALTY_REDEM: "loyalty_redem",//
    BALANCE_POINTS: "balance_points",//
    RETURN_AMOUNT: "return_amount",//
    RETURN_BILLNO: "return_billno",//
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CASH_AMOUNT: "cash_amount",
    CARD_AMOUNT: "card_amount",
    UPI_AMOUNT: "upi_amount",
    LESS_AMOUNT: "less_amount",
    DISCOUNT_AMOUNT: "discount_amount",

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
    UPDATED_BY: "updated_by"
  }
};

const SALESMANLEDGER = {
  NAME: "salesman_ledger",
  COLUMNS: {
    ID: "id",
    DOCDATE: "docdate",
    SALESMAN_ID: "salesman_id",
    SALES: "sales",
    RETURN: "return",
    OUTLETID: "outletid",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const SALESRETURNMASTER = {
  NAME: "sales_return_master",
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
    BILLNO: "billno",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const OUTLETSALESDETAILS = {
  NAME: "outlet_sales_details",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    OUTLETID: "outletid",
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
const SALESRETURNDETAILS = {
  NAME: "sales_return_details",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    SALES_MST_ID: "sales_mst_id",
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

const OUTLETS = {
  NAME: "outlets",
  COLUMNS: {
    ID: "id",
    CODE: "code",
    SHORTNAME: "short_name",
    FULLNAME: "fullname",
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
    OUTLETTYPE: "outlet_type",
    BANKACNO: "bankacno",
    BANKNAME: "bankname",
    ACNAME: "acname",
    IFSCCODE: "ifsccode",
    BALANCE: "balance",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    ISGST: "is_gst",
    FRANCHISETYPE: "franchise_type",
    BALANCE: "balance",
    REF_DOC_NO: "ref_doc_no",
    WH_ID: "wh_id"
  }
};

const OUTLETTYPE = {
  NAME: "outlet_type",
  COLUMNS: {
    ID: "id",
    OUTLETTYPE: "outlet_type",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const FRANCHISETYPE = {
  NAME: "franchise_type",
  COLUMNS: {
    ID: "id",
    FRANCHISETYPE: "franchise_type",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

module.exports = {
  OUTLETSALESMASTER,
  OUTLETSALESDETAILS,
  STOCKLEDGER,
  OUTLETSTOCKLEDGER,
  SALESRETURNMASTER,
  SALESRETURNDETAILS,
  OUTLETMEMBERS,
  SALESMANLEDGER,
  OUTLETS,
  OUTLETTYPE,
  FRANCHISETYPE
};