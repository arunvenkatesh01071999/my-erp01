
const PACKING_ISSUE_MASTER = {
  NAME: "packing_issue_master",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    WH_ID: "wh_id",
    TOTAL_ITEMS: "total_items",
    TOTAL_QTY: "total_qty",
    AMOUNT: "amount",
    IS_INWARD: "is_inward",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const PACKING_ISSUE_DETAILS = {
  NAME: "packing_issue_details",
  COLUMNS: {
    ID: "id",
    PACKING_ISSUE_MST_ID: "packing_issue_mst_id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    WH_ID: "wh_id",
    PROD_ID: "prod_id",
    TOTAL_QTY: "total_qty",
    CAT_ID: "cat_id",
    SUB_CAT_ID: "sub_cat_id",
    HEAD_ID: "head_id",
    TYPE_DESIGN_ID: "type_design_id",
    UOM_ID: "uom_id",
    BARCODE: "barcode",
    PUR_RATE: "pur_rate",
    SALE_RATE: "sale_rate",
    WHOLESALE_RATE: "wholesale_rate",
    MRP: "mrp",
    GST: "gst",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
}


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
    UPDATED_BY: "updated_by",
    WH_ID: "wh_id"
  }
};

const PACKING_INWARD_MASTER = {
  NAME: "packing_inward_master",
  COLUMNS: {
    ID: "id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    PACKING_ISSUE_DOCNO: "packing_issue_docno",
    PACK_ISSUE_ID: "pack_issue_id",
    WH_ID: "wh_id",
    TOTAL_ITEMS: "total_items",
    TOTAL_QTY: "total_qty",
    AMOUNT: "amount",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const PACKING_INWARD_DETAILS = {
  NAME: "packing_inward_details",
  COLUMNS: {
    ID: "id",
    PACKING_INWARD_MST_ID: "packing_inward_mst_id",
    PACKING_ISSUE_DOCNO: "packing_issue_docno",
    PACK_ISSUE_ID: "pack_issue_id",
    DOCNO: "docno",
    DOCDATE: "docdate",
    WH_ID: "wh_id",
    PROD_ID: "prod_id",
    TOTAL_QTY: "total_qty",
    CAT_ID: "cat_id",
    SUB_CAT_ID: "sub_cat_id",
    HEAD_ID: "head_id",
    TYPE_DESIGN_ID: "type_design_id",
    UOM_ID: "uom_id",
    BARCODE: "barcode",
    PUR_RATE: "pur_rate",
    SALE_RATE: "sale_rate",
    WHOLESALE_RATE: "wholesale_rate",
    MRP: "mrp",
    GST: "gst",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const ISSUE_BASED_SETTING = {
  NAME: "issue_based_setting",
  COLUMNS: {
    ID: "id",
    ISSUE_BASED: "issue_based"
  }
};
const WAREHOUSE_STOCKS = {
  NAME: "warehouse_stocks",
  COLUMNS: {
    ID: "id",
    PROD_ID: "prod_id",
    WH_ID: "wh_id",
    STOCK: "stock",
    CREATED_BY: "created_by",
    CREATED_AT: "created_at",
    UPDATED_BY: "updated_by",
    UPDATED_AT: "updated_at"
  }
};


module.exports = {
  PACKING_ISSUE_MASTER,
  PACKING_ISSUE_DETAILS,
  STOCKLEDGER,
  PACKING_INWARD_MASTER,
  PACKING_INWARD_DETAILS,
  ISSUE_BASED_SETTING,
  WAREHOUSE_STOCKS
};