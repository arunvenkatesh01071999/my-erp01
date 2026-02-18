const OFFER_LOGS = {
  NAME: "offer_logs",
  COLUMNS: {
    ID: "id",
    OPERATION_NAME: "operation_name",
    USER_ID: "user_id",
    OFFER_ID: "offer_id",
    COMPANY_ID: "company_id",
    ONAME: "oname",
    USER_NAME: "user_name",
    OPERATION_DATE: "operation_date"
  }
};
const OFFER = {
  NAME: "offer",
  COLUMNS: {
    ID: "oid",
    ONAME: "oname",
    IS_ACTIVE: "is_active",
    COMPANY_ID: "company_id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

module.exports = {
  OFFER,
  OFFER_LOGS
};
