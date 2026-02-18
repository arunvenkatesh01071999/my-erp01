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


const MAIN_CATEGORY_LOGS = {
  NAME: "main_category_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    CATEGORY_ID: "category_id",
    CATEGORY_NAME: "category_name",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};

const SUB_CATEGORY = {
  NAME: "sub_category",
  COLUMNS: {
    ID: "id",
    SUBCATEGORY_NAME: "subcategory_name",
    CATEGORY_ID: "category_id",
    SUBCATEGORY_IMAGE: "subcategory_image",
    IS_INSERTED: "is_inserted",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active"
  }
};

const SESSIONS = {
  NAME: "sessions",
  COLUMNS: {
    ID: "id",
    NAME: "name",
    COMPANY_ID: "com_id",
    ST_TIME: "st_time"
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

module.exports = {
  MAIN_CATEGORY,
  SUB_CATEGORY,
  SESSIONS,
  BRANDS,
  MAIN_CATEGORY_LOGS
};
