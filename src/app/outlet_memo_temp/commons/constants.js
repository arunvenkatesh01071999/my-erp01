
const OUTLET_PURCHASE_MEMO_MASTER_TEMP = {
  NAME: "outlet_purchase_memo_master_temp",
  COLUMNS: {
    ID: "id",
    MEMO_NO: "memo_no",
    MEMO_DATE: "memo_date",
    PO_NO: "po_no",
    PO_DATE: "po_date",
    SUPPLIER_ID: "supplier_id",
    OUTLET_ID: "outlet_id",
    COMPANY_ID: "company_id",
    WAREHOUSE_ID: "warehouse_id",
    INVOICE_NO: "invoice_no",
    INVOICE_DATE: "invoice_date",
    INVOICE_AMOUNT: "invoice_amount",
    IMAGE_URL: "image_url",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    IS_ACTIVE: "is_active"
  }
};

const OUTLET_PURCHASE_MEMO_DETAILS_TEMP = {
  NAME: "outlet_purchase_memo_details_temp",
  COLUMNS: {
    ID: "id",
    OP_MEMO_MST_TEMP_ID: "op_memo_mst_temp_id",
    MEMO_NO: "memo_no",
    MEMO_DATE: "memo_date",
    PO_NO: "po_no",
    COMPANY_ID: "company_id",
    SUPPLIER_ID: "supplier_id",
    OUTLET_ID: "outlet_id",
    WAREHOUSE_ID: "warehouse_id",
    PROD_ID: "prod_id",
    PROD_CODE: "prod_code",
    UOM_ID: "uom_id",
    PO_QTY: "po_qty",
    MEMO_QTY: "memo_qty",
    MEMO_RETURN_QTY: "memo_return_qty",
    MEMO_FREE_QTY: "memo_free_qty",
    MEMO_TOTAL_QTY: "memo_total_qty",
    MEMO_MRP: "memo_mrp",
    PO_MRP: "po_mrp",
    EXP_PERIOD: "exp_period",
    TYPE_ID: "type_id",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",

  }
};

const OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP = {
  NAME: "outlet_purchase_memo_batch_details_temp",
  COLUMNS: {
    ID: "id",
    OP_MEMO_MST_TEMP_ID: "op_memo_mst_temp_id",
    PRODUCT_ID: "product_id",
    PRODUCT_CODE: "product_code",
    BATCH_NO: "batch_no",
    MEMO_QTY: "memo_qty",
    MEMO_MRP: "memo_mrp",
    MEMO_FREE_QTY: "memo_free_qty",
    SELF_LIFE_EXPIRY_DAYS: "self_life_expiry_days",
    MEMO_RETURN_QTY: "memo_return_qty",
    COMPANY_ID: "company_id",
    MANUFACTURE_DATE: "manufacture_date",
    EXPIRY_ID: "expiry_id",
    EXPIRY_VALUE: "expiry_value",
    EXPIRY_DATE: "expiry_date"
  }
};


module.exports = {
  OUTLET_PURCHASE_MEMO_MASTER_TEMP,
  OUTLET_PURCHASE_MEMO_DETAILS_TEMP,
  OUTLET_PURCHASE_MEMO_BATCH_DETAILS_TEMP
};
