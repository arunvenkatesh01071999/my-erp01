const MAIN_CATEGORY = {
  NAME: "main_category",
  COLUMNS: {
    ID: "id",
    CATEGORY_NAME: "category_name",
    CATEGORY_IMAGE: "category_image",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active"
  }
};

const SUB_CATEGORY = {
  NAME: "sub_category",
  COLUMNS: {
    ID: "id",
    SUBCATEGORY_NAME: "subcategory_name",
    CATEGORY_ID: "category_id",
    SUBCATEGORY_IMAGE: "subcategory_image",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active"
  }
};
const SUB_CATEGORY_LOGS = {
  NAME: "sub_category_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    CATEGORY_ID: "category_id",
    SUBCATEGORY_ID: "subcategory_id",
    SUBCATEGORY_NAME: "subcategory_name",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};
const BRANDS = {
  NAME: "brands",
  COLUMNS: {
    ID: "id",
    BRAND_NAME: "brand_name",
    BRAND_IMAGE: "brand_image",
    IS_ACTIVE: "is_active"
  }
};

const ITEM = {
  NAME: "item",
  COLUMNS: {
    ID: "id",
    PRODUCT_CODE: "pro_code",
    SHORT_NAME: "short_name",
    PRO_DESCRIPTION: "pro_description",
    REGIONAL_NAME: "regional_name",
    PRODUCT_NAME: "pro_name",
    COMPANY_ID: "company_id",
    TYPE_ID: "type_id",
    MAIN_CATEGORY_ID: "main_catgory_id",
    MERCHANT_CATEGORY_ID: "merchant_category_id",
    SUB_CATEGORY_ID: "sub_category_id",
    HEAD_ID: "head_id",
    TYPEDESIGN_ID: "typedesign_id",
    MAIN_UOM_ID: "main_uom_id",
    UOM_ID: "uom_id",
    MRP: "mrp",
    PURCHASE_RATE: "pur_rate",
    SALE_RATE: "sale_rate",
    WHOLESALE_RATE: "wholesale_rate",
    GST: "gst",
    CESS: "cess",
    HSN: "hsn",
    OPENING_STOCK: "op_stk",
    BALANCE: "balance",
    MIN_STOCK: "min_stock",
    INCHARGE_ID: "incharge_id",
    TRAY_ID: "tray_id",
    EXPIRY_TYPE_ID: "expiry_type_id",
    EXPIRY_VALUE: "expiry_value",
    MBQ: "mbq",
    SHRINKAGE: "shrinkage",
    CASE_QTY: "case_qty",
    PUTAWAY: "putaway",
    BULK_ITEM: "bulk_item",
    RETURNABLE_ITEM: "returnable_item",
    PURCHASE: "purchase",
    MIN_STOCK_WARNING: "min_stock_warning",
    BATCH_ITEM: "batch_item",
    OUTLET_PURCHASE: "outlet_purchase",
    OUTLET_NON_SALEABLE: "outlet_non_saleable",
    ALLOW_NEG_STK: "allow_neg_stk",
    GST_INCLUSIVE: "gst_inclusive",
    WSCALE: "wscale",
    CONVERSION_FACTOR: "convertion_factor",
    DISCOUNT: "discount",
    EXPIRY_DATE: "expiry_date",
    MAIN_PRODUCT_ID: "main_product_id",
    MAIN_PRODUCT_QTY: "main_product_qty",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    IS_INSERTED: "is_inserted"
  }
};


module.exports = {
  MAIN_CATEGORY,
  SUB_CATEGORY,
  BRANDS,
  SUB_CATEGORY_LOGS,
  ITEM
};
