// Constants for schemes table
const SCHEMES = {
  NAME: "schemes",
  COLUMNS: {
    SID: "sid",
    SNAME: "sname",
    FDATE: "fdate",
    TDATE: "tdate",
    PAMOUNT: "pamount",
    DTYPE: "dtype",
    DVAL: "dval",
    ACTIVE: "active",
    PID: "pid",
    SMODE: "smode",
    OUTLET_ID: "outlet_id",
    STYPE: "stype",
    CATID: "cat_id",
    QTY: "qty",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

// Constants for schemes_outlet table
const SCHEMES_OUTLET = {
  NAME: "schemes_outlet",
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

// Constants for schemes_logs table
const SCHEMES_LOGS = {
  NAME: "schemes_logs",
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
  SCHEMES,
  SCHEMES_OUTLET,
  SCHEMES_LOGS
};
