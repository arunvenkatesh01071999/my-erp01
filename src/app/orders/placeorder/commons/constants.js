const ORDERS_MASTERS = {
  NAME: "orders_masters",
  COLUMNS: {
    ID: "id",
    CUSTOMERS_ID: "customers_id",
    ADDRESS_ID: "address_id",
    ORDERS_TOTAL: "orders_total",
    ORDERS_DISCOUNT_AMOUNT: "orders_discount_amount",
    ORDERS_NO_OF_ITEMS: "orders_no_of_items",
    ORDERS_ITEMS_QTY: "orders_items_qty",
    ORDERS_WEIGHT: "orders_weight",
    ORDERS_DELIVERY_CHARGE: "orders_delivery_charge",
    ORDERS_TYPE: "orders_type",
    ORDERS_MODE: "orders_mode",
    ORDERS_STATUS: "orders_status",
    ORDERS_TRANSACTIONS_ID: "orders_transactions_id",
    ORDERS_ACTION_DATE: "orders_action_date",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const ORDERS_DETAILS = {
  NAME: "orders_details",
  COLUMNS: {
    ID: "id",
    ORDERS_ID: "orders_id",
    CUSTOMERS_ID: "customers_id",
    ORDERS_ITEMS_TOTAL: "orders_items_total",
    ORDERS_ITEMS_DISCOUNT: "orders_items_discount",
    PRODUCTS_CODE: "products_code",
    UNITS_ID: "units_id",
    ORDERS_QUANTITY: "orders_quantity",
    ORDERS_RATE: "orders_rate",
    ORDERS_GST: "orders_gst",
    ORDERS_IGST: "orders_igst",
    ORDERS_CESS: "orders_cess",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const CUSTOMERS = {
  NAME: "customers",
  COLUMNS: {
    ID: "id",
    CUSTOMERS_NAME: "customers_name",
    CUSTOMERS_MOBILE: "customers_mobile",
    CUSTOMERS_EMAIL: "customers_email",
    CUSTOMERS_GENDER: "customers_gender",
    CUSTOMERS_DOB: "customers_dob",
    CUSTOMERS_BLOOD_GROUP: "customers_blood_group",
    CUSTOMERS_IMAGE: "customers_image",
    IS_ACTIVE: "is_active",
    IS_VERIFIED: "is_verified",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const CUSTOMERS_ADDRESS = {
  NAME: "customers_address",
  COLUMNS: {
    ID: "id",
    CUSTOMERS_ID: "customers_id",
    ADDRESS_TYPE: "address_type",
    ADDRESS_LINE1: "address_line1",
    ADDRESS_LINE2: "address_line2",
    ADDRESS_LINE3: "address_line3",
    ALTERNATIVE_MOBILE: "alternative_mobile",
    LONGITUDE: "longitude",
    LATITUDE: "latitude",
    STATE: "state",
    CITY: "city",
    COUNTRY: "country",
    IS_DEFAULT: "is_default",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};
const ADDRESS_TYPE = {
  NAME: "address_type",
  COLUMNS: {
    ID: "id",
    ADDRESS_TYPE: "address_type",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
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
const CART = {
  NAME: "cart",
  COLUMNS: {
    ID: "id",
    CUSTOMERS_ID: "customers_id",
    PRODUCTS_CODE: "products_code",
    UNITS_ID: "units_id",
    CART_QUANTITY: "cart_quantity",
    PRODUCTS_RATE: "products_rate",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

module.exports = {
  ORDERS_MASTERS,
  ORDERS_DETAILS,
  CUSTOMERS,
  CUSTOMERS_ADDRESS,
  ADDRESS_TYPE,
  UNITS,
  PRODUCTS,
  PRODUCTS_IMAGES,
  CART
};
