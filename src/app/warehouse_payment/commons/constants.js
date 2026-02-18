const WAREHOUSE_PAYMENT_MASTER = {
  NAME: "warehouse_payment_master",
  COLUMNS: {
    ID: "id",
    DATE: "date",
    DOC_NO: "doc_no",
    SUPPLIER_ID: "supplier_id",
    WAREHOUSE_ID: "warehouse_id",
    MODE: "mode",
    AMOUNT: "amount",
    CHEQUE_NO: "cheque_no",
    CHEQUE_DATE: "cheque_date",
    BANK: "bank",
    DISCOUNT: "discount",
    REF_NO: "ref_no",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
  }
};

const WAREHOUSE_PAYMENT_DETAIL = {
  NAME: "warehouse_payment_detail",
  COLUMNS: {
    ID: "id",
    WP_MST_ID: "wp_mst_id",
    SUPPLIER_ID: "supplier_id",
    WAREHOUSE_ID: "warehouse_id",
    DATE: "date",
    INVOICE_NO: "invoice_no",
    AMOUNT: "amount",
    PENDING_AMOUNT: "pending_amount",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

module.exports = {
  WAREHOUSE_PAYMENT_MASTER,
  WAREHOUSE_PAYMENT_DETAIL
};
