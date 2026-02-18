
const WAREHOUSE_CLEANING_STOCK_MASTER = {
  NAME: "warehouse_cleaning_stock_master",
  COLUMNS: {
    ID: "id",
    WAREHOUSE_ID: "warehouse_id",
    DOC_NO: "doc_no",
    DOC_DATE: "doc_date",
    TOTAL_CLEANED_STOCK: "total_cleaned_stock",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
  }
};

const WAREHOUSE_CLEANING_STOCK_DETAILS = {
  NAME: "warehouse_cleaning_stock_details",
  COLUMNS: {
    ID: "id",
    WC_MST_ID: "wc_mst_id",
    WAREHOUSE_ID: "warehouse_id",
    PRODUCT_ID: "product_id",
    PRODUCT_CODE: "product_code",
    TOTAL_STOCK: "total_stock",
    PICKED_CLEANING_STOCK: "picked_cleaning_stock",
    WASTAGE_STOCK: "wastage_stock",
    CLEANING_STOCK: "cleaning_stock",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",

  }
};




module.exports = {
  WAREHOUSE_CLEANING_STOCK_MASTER,
  WAREHOUSE_CLEANING_STOCK_DETAILS
};
