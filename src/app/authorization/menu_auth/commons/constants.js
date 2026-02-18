const USERS = {
  NAME: "users",
  COLUMNS: {
    ID: "id",
    USER_NAME: "user_name",
    USER_EMAIL: "user_email",
    USER_MOBILE: "user_mobile",
    USER_PASSWORD: "user_password",
    COMPANY_ID: "company_id",
    USER_TYPE: "user_type",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    PASSWORD_UPDATED_AT: "password_updated_at",
    LOGIN_UPDATED_AT: "login_updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    IS_LOGGING: "is_logging"
  }
};
const ROLES = {
  NAME: "roles",
  COLUMNS: {
    ID: "id",
    ROLE_NAME: "role_name",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};
const ROLE_MAPPING = {
  NAME: "roles_mapping",
  COLUMNS: {
    ID: "id",
    USER_ID: "user_id",
    ROLE_ID: "role_id",
    COMPANY_ID: "company_id",
    IS_OUTLET: "is_outlet",
    IS_WAREHOUSE: "is_warehouse",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};
const OUTLET_MAPPING = {
  NAME: "outlet_mapping",
  COLUMNS: {
    ID: "id",
    USER_ID: "user_id",
    OUTLET_ID: "outlet_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const WAREHOUSE_MAPPING = {
  NAME: "warehouse_mapping",
  COLUMNS: {
    ID: "id",
    USER_ID: "user_id",
    WAREHOUSE_ID: "warehouse_id",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const USERS_LOGS = {
  NAME: "users_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    CREATE_USER_ID: "createuser_id",
    CREATE_USER_NAME: "createuser_name",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};

module.exports = {
  USERS,
  ROLES,
  ROLE_MAPPING,
  OUTLET_MAPPING,
  WAREHOUSE_MAPPING,
  USERS_LOGS
};
