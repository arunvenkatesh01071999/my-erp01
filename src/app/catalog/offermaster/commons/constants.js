const OFFER_MASTER = {
  NAME: "offer_master",
  COLUMNS: {
    OID: "oid",
    OTYPE: "otype",
    ONAME: "oname",
    OBUY: "obuy",
    OGET: "oget",
    PFROM: "pfrom",
    PTO: "pto",
    ACTIVE: "active",
    OBUYID: "obuyid",
    OGETID: "ogetid",
    UID: "uid",
    DIS: "dis",
    POFF: "poff",
    OMODE: "omode",
    OUTLETID: "outletid",
    PPARTNER: "ppartner",
    PCOMPAMT: "pcompamt",
    PLOCAMT: "plocamt",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const OFFER_MASTER_OUTLET = {
  NAME: "offer_master_outlet",
  COLUMNS: {
    ID: "id",
    OID: "oid",
    OUTLET_ID: "outlet_id",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const OFFER_MASTER_PARTNER = {
  NAME: "offer_master_partner",
  COLUMNS: {
    ID: "id",
    OID: "oid",
    PPARTNER_ID: "ppartner_id",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};
const OFFER_MASTER_LOGS = {
  NAME: "offer_master_logs",
  COLUMNS: {
    ID: "id",
    OID: "oid",
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
  OFFER_MASTER,
  OFFER_MASTER_OUTLET,
  OFFER_MASTER_PARTNER,
  OFFER_MASTER_LOGS
};
