
const STORES_CUSTOMER = {
  NAME: "stores_customer",
  COLUMNS: {
    ID: "id",
    NAME: "name",
    SHORT_NAME: "short_name",
    CUSTOMER_CODE: "customer_code",
    GROUP_ID: "group_id",
    ALLOCATE_GROUP: "allocate_group",
    ADDRESS1: "address1",
    ADDRESS2: "address2",
    COUNTRY_ID: "country_id",
    STATE_ID: "state_id",
    CITY_ID: "city_id",
    STATE_CODE: "state_code",
    PINCODE: "pincode",
    PHONE: "phone",
    MOBILE: "mobile",
    EMAIL: "email",
    WEBSITE: "website",
    GSTIN: "gstin",
    CST: "cst",
    PAN_NUMBER: "pan_number",
    OPENING_BALANCE: "opening_balance",
    BALANCE: "balance",
    WEB_ID: "web_id",
    LOCATION_ID: "location_id",
    WAREHOUSE_ID: "warehouse_id",
    EXPORT: "export",
    SALES_MARGIN: "sales_margin",
    CUSTOMER_TYPE: "customer_type",
    GST_TYPE: "gst_type",
    DEFAULT_CASH_SALES: "default_cash_sales",
    WEB_ORDER: "web_order",
    WEB_SALES_EXPORT: "web_sales_export",
    BULK_SALES: "bulk_sales",
    GROCERY_TRAY: "grocery_tray",
    MARGIN_ACTIVE: "margin_active",
    DELIVERY_ADDRESS1: "delivery_address1",
    DELIVERY_ADDRESS2: "delivery_address2",
    DELIVERY_COUNTRY_ID: "delivery_country_id",
    DELIVERY_STATE_ID: "delivery_state_id",
    DELIVERY_CITY_ID: "delivery_city_id",
    DELIVERY_PINCODE: "delivery_pincode",
    DELIVERY_STATE_PINCODE: "delivery_state_code",
    STATUS: "status",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    USER_ID: "user_id",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    WH_ID: "wh_id"
  }
};

const STORES_CUSTOMER_MAPPING = {
  NAME: "stores_customer_mapping",
  COLUMNS: {
    ID: "id",
    CUSTOMER_ID: "customer_id",
    CUSTOMER_CODE: "customer_code",
    CUSTOMER_NAME: "customer_name",
    OUTLET_ID: "outlet_id",
    ADDRESS1: "add1",
    ADDRESS2: "add2",
    COUNTRY_ID: "country_id",
    STATE_ID: "state_id",
    CITY_ID: "city_id",
    PINCODE: "pincode",
    PHONE: "phone",
    EMAIL: "email",
    ALTER_EMAIL: "alter_email",
    MOBILE: "mobile",
    OPENING_BALANCE: "op_bal",
    BALANCE: "balance",
    CUSTOMER_TYPE: "customer_type",
    GST_TYPE: "gst_type",
    BANK_ACCOUNT_NO: "bank_ac_no",
    BANK_NAME: "bankname",
    ACCOUNT_NAME: "ac_name",
    IFSC_CODE: "ifsccode",
    GSTIN: "gstin",
    FSSAI_NO: "fssaino",
    PAN_NUMBER: "pan_number",
    WH_ID: "wh_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    REGION_ID: "region_id",
    CONTACT_PERSON: "contact_person",
  }
};

const STORES_CUSTOMER_LOGS = {
  NAME: "stores_customer_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    CUSTOMER_ID: "customer_id",
    CUSTOMER_NAME: "customer_name",
    USER_ID: "user_id",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};


module.exports = {
  STORES_CUSTOMER,
  STORES_CUSTOMER_MAPPING,
  STORES_CUSTOMER_LOGS
};



