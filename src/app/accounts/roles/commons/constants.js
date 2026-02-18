const ROLES = {
  NAME: "roles",
  COLUMNS: {
    ID: "id",
    ROLE_NAME: "role_name",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    IS_OUTLET: "is_outlet",
    IS_WAREHOUSE: "is_warehouse",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const ROLE_LOGS = {
  NAME: "role_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    ROLE_ID: "role_id",
    ROLE_NAME: "role_name",
    USER_ID: "user_id",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};

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
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
    IS_LOGGING: "is_logging"
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


module.exports = {
  ROLES,
  ROLE_LOGS,
  USERS,
  ROLE_MAPPING
};
