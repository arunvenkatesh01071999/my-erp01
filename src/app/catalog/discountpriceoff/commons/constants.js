const PRICEOFF = {
  NAME: 'priceoff',
  COLUMNS: {
    ID: 'id',
    PROD_CODE: 'prod_code',
    AMOUNT: 'amount',
    ETYPE: 'etype',
    PFROM: 'pfrom',
    PTO: 'pto',
    OUTLET: 'outlet',
    PID: 'pid',
    PNAME: 'pname',
    PPARTNER: 'ppartner',
    PCOMPAMT: 'pcompamt',
    PLOCAMT: 'plocamt',
    PACTIVE: 'pactive',
    OID: 'oid',
    DOWNDT: 'downdt',
    STATUS: 'status',
    UID: 'uid',
    PMRP: 'pmrp',
    COMPANY_ID: 'company_id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
  },
};

const PRICEOFF_OUTLET = {
  NAME: 'priceoff_outlet',
  COLUMNS: {
    ID: 'id',
    PRICEOFF_ID: 'priceoff_id',
    OUTLET_ID: 'outlet_id',
    IS_ACTIVE: 'is_active',
    COMPANY_ID: 'company_id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by'
  },
};

const PRICEOFF_PARTNER = {
  NAME: 'priceoff_partner',
  COLUMNS: {
    ID: 'id',
    PRICEOFF_ID: 'priceoff_id',
    PPARTNER_ID: 'ppartner_id',
    IS_ACTIVE: 'is_active',
    COMPANY_ID: 'company_id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
  },
};

const PRICEOFF_LOGS = {
  NAME: 'priceoff_logs',
  COLUMNS: {
    ID: 'id',
    PRICEOFF_ID: 'priceoff_id',
    OLD_DATA: 'old_data',
    CHANGED_DATA: 'changed_data',
    OPERATION_NAME: 'operation_name',
    COMPANY_ID: 'company_id',
    OPERATION_DATE: 'operation_date',
    USER_NAME: 'user_name',
    USER_ID: 'user_id',
  },
};

module.exports = {
  PRICEOFF,
  PRICEOFF_OUTLET,
  PRICEOFF_PARTNER,
  PRICEOFF_LOGS,
};
