// Constants for promotion table
const PROMOTION = {
  NAME: "promotion",
  COLUMNS: {
    PID: "pid",
    PNAME: "pname",
    PAMOUNT: "pamount",
    FDATE: "fdate",
    TDATE: "tdate",
    ACTIVE: "active",
    OUTLET: "outlet",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// Constants for promotion_outlet table
const PROMOTION_OUTLET = {
  NAME: "promotion_outlet",
  COLUMNS: {
    ID: "id",
    PID: "pid",
    OUTLET_ID: "outlet_id",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// Constants for promotion_logs table
const PROMOTION_LOGS = {
  NAME: "promotion_logs",
  COLUMNS: {
    ID: "id",
    PID: "pid",
    OLD_DATA: "old_data",
    CHANGED_DATA: "changed_data",
    OPERATION_NAME: "operation_name",
    COMPANY_ID: "company_id",
    OPERATION_DATE: "operation_date",
    USER_NAME: "user_name",
    USER_ID: "user_id"
  }
};

module.exports = {
  PROMOTION,
  PROMOTION_OUTLET,
  PROMOTION_LOGS
};
