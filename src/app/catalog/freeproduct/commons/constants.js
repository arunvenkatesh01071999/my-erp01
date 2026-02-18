// Constants for freeproduct table
const FREEPRODUCT = {
  NAME: "freeproduct",
  COLUMNS: {
    SID: "sid",
    FNAME: "fname",
    FFROM: "ffrom",
    FTO: "fto",
    ACTIVE: "active",
    OUTLET: "outlet",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// Constants for freeproduct_outlet table
const FREEPRODUCT_OUTLET = {
  NAME: "freeproduct_outlet",
  COLUMNS: {
    ID: "id",
    SID: "sid",
    OUTLET_ID: "outlet_id",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// Constants for freeproduct_logs table
const FREEPRODUCT_LOGS = {
  NAME: "freeproduct_logs",
  COLUMNS: {
    ID: "id",
    SID: "sid",
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
  FREEPRODUCT,
  FREEPRODUCT_OUTLET,
  FREEPRODUCT_LOGS
};
