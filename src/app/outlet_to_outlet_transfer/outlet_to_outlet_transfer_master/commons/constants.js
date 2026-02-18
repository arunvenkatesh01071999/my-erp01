const OUTLET_TO_OUTLET_TRANSFER_MASTER = {
  NAME: "outlet_to_outlet_transfer_master",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    STATUS: "status",
    FROM_OUTLET_ID: "from_outlet_id",
    TO_OUTLET_ID: "to_outlet_id",
    USER_ID: "user_id",
    OUTLETID: "outletid",
    AMOUNT: "amount",
    SUBTOTAL_AMOUNT: "subtotal_amount",
    GST_PER: "gst_per",
    GST_AMT: "gst_amt",
    CESS_PER: "cess_per",
    CESS_AMT: "cess_amt",
    ROFF: "roff",
    IS_CREDIT: "is_credit",
    OUTSTANDING: "outstanding",
    COMPANY_ID: "company_id",
    GET_IN: "gst_in",
    IS_OWNED: "is_owned",
    IS_APPROVED: "is_approved",
    IS_APPROVED_DATE: "is_approved_date",
    IS_APPROVED_BY: "is_approved_by",
    ISSUE_TRANS_DOC_NO: "issue_trans_doc_no",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",

  }
};


const OUTLET_TO_OUTLET_TRANSFER_DETAILS = {
  NAME: "outlet_to_outlet_transfer_details",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    OUTLET_TO_OUTLET_TRANSFER_MASTER_ID: "outlet_to_outlet_transfer_master_id",
    FROM_OUTLET_ID: "from_outlet_id",
    TO_OUTLET_ID: "to_outlet_id",
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

const OUTLET_PRODUCT_MAPPING = {
  NAME: "outlet_products_mapping",
  COLUMNS: {
    ID: "id",
    PRODUCT_ID: "pro_id",
    PRODUCT_CODE: "pro_code",//1
    OUTLET_ID: "outlet_id",
    OPENING_STOCK: "opng_stock",//1
    BALENCE_STOCK: "balnc_stock",//0
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const BARCODE_LIST = {
  NAME: "barcode_list",
  COLUMNS: {
    ID: "id",
    PROD_ID: "prod_id",
    BARCODE: "barcode",
    IS_SOLD: "is_sold",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    OUTLET_ID: "outlet_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    PURCHASE_NO: "purchase_no"
  }
};


module.exports = {
  OUTLET_TO_OUTLET_TRANSFER_MASTER,
  OUTLET_TO_OUTLET_TRANSFER_DETAILS,
  BARCODE_LIST,
  OUTLET_PRODUCT_MAPPING

};