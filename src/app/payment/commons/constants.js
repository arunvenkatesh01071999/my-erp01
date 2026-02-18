const PAYMENT_MASTER = {
    NAME: "payment_master",
    COLUMNS: {
      ID: "id",
      DATE: "date",
      SUPPLIER_ID:"supplierid",
      MODE:"mode",
      AMOUNT:"amount",
      CHEQUENO:"chequeno",
      CHEQUEDATE:"chequedate",
      BANK:"bank",
      DISCOUNT:"discount",
      REFNO:"refno",
      COMPANY_ID: "company_id",
      CREATED_AT: "created_at",
      UPDATED_AT: "updated_at",
      CREATED_BY: "created_by",
      UPDATED_BY: "updated_by"
    }
  };

  const PAYMENT_DETAIL = {
    NAME: "payment_detail",
    COLUMNS: {
      ID: "id",
      PM_ID: "pm_id",
      DATE:"date",
      INVOICE_NO:"invoice_no",
      AMOUNT:"amount",
      PENDING_AMOUNT:"pending_amount",
      COMPANY_ID: "company_id",
      CREATED_AT: "created_at",
      UPDATED_AT: "updated_at",
      CREATED_BY: "created_by",
      UPDATED_BY: "updated_by"
    }
  };

  module.exports ={
    PAYMENT_MASTER,
    PAYMENT_DETAIL

  }
 
  
 