const UNITS = {
  NAME: "units",
  COLUMNS: {
    ID: "id",
    UNITS_SHORT_NAME: "units_short_name",
    UNITS_LONG_NAME: "units_long_name",
    COMPANY_ID: "company_id",
    IS_ACTIVE: "is_active",
    IS_INSERTED: "is_inserted",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at"
  }
};

const UNITS_LOGS = {
  NAME: "units_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    UNIT_ID: "unit_id",
    COMPANY_ID: "company_id",
    UNITS_SHORT_NAME: "unit_short_name",
    UNITS_LONG_NAME: "unit_long_name",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};


module.exports = {
  UNITS,
  UNITS_LOGS
};
