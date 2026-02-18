const PRODUCTS = {
  NAME: "products",
  COLUMNS: {
    ID: "id",
    PRODUCT_CODE: "product_code",
    PRODUCT_SHORT_DESCRIPTION: "product_short_description",
    PRODUCT_LONG_DESCRIPTION: "product_long_description",
    BRANDS_ID: "brands_id",
    GROUPS_ID: "groups_id",
    MAIN_CATEGORY_ID: "main_category_id",
    SUB_CATEGORY_ID: "sub_category_id",
    STOCK_STATUS: "stock_status",
    SELLER_INFORMATION: "seller_information",
    DIRECTION_OF_USAGE: "direction_of_usage",
    SAFETY_INFORMATION: "safety_information",
    MANUFACTURAR_INFORMATION: "maufacturar_information",
    BENEFITS: "benefits",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const PRODUCTS_VARIANTS = {
  NAME: "products_variants",
  COLUMNS: {
    PRODUCTS_ID: "products_id",
    PRODUCTS_CODE: "products_code",
    UNITS_ID: "units_id",
    MRP: "mrp",
    SALES_PRICE: "sales_price",
    DISCOUNT_PERCETAGE: "discount_percentage",
    DISCOUNT_AMOUNT: "discount_amount",
    MINIMUM_SALES_QTY: "minimum_sales_qty",
    MAXIMUM_SALES_QTY: "maximum_sales_qty",
    STOCK_STATUS: "stock_status",
    PACKING_WEIGHT: "packing_weight",
    GST: "gst",
    IGST: "igst",
    CESS: "cess",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const MAIN_CATEGORY = {
  NAME: "main_category",
  COLUMNS: {
    ID: "id",
    CATEGORY_NAME: "category_name",
    CATEGORY_IMAGE: "category_image",
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
    IS_ACTIVE: "is_active"
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
const UNITS = {
  NAME: "units",
  COLUMNS: {
    ID: "id",
    UNITS_SHORT_NAME: "units_short_name",
    UNITS_LONG_NAME: "units_long_name",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const GROUPS = {
  NAME: "groups",
  COLUMNS: {
    ID: "id",
    GROUP_NAME: "group_name",
    GROUP_IMAGE: "group_image",
    IS_ACTIVE: "is_active"
  }
};
const PRODUCTS_IMAGES = {
  NAME: "products_images",
  COLUMNS: {
    ID: "id",
    PRODUCT_CODE: "products_code",
    PRODUCT_IMAGE: "products_image",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

module.exports = {
  PRODUCTS,
  PRODUCTS_VARIANTS,
  MAIN_CATEGORY,
  SUB_CATEGORY,
  BRANDS,
  UNITS,
  GROUPS,
  PRODUCTS_IMAGES
};
