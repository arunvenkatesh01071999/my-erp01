const RECEIPT_MASTER = {
    NAME: "receipt_master",
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



  const RECEIPT_DETAIL = {
    NAME: "receipt_detail",
    COLUMNS: {
      ID: "id",
      RM_ID: "rm_id",
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

  const SALESMASTER = {
    NAME: "sales_master",
    COLUMNS: {
      ID: "id",
      DOCNO:"docno",
      DOCDATE:"docdate",
      PARTYCODE:"partycode",
      AMOUNT:"amount",
      SUBTOTAL_AMOUNT:"subtotal_amount",
      GST_PER:"gst_per",
      GST_AMT:"gst_amt",
      CESS_PER:"cess_per",
      CESS_AMT:"cess_amt",
      ROFF:"roff",
      MODE:"mode",
      OUTSTANDING:"outstanding",
      COMPANY_ID:"company_id",
      CREATED_AT:"created_at",
      UPDATED_AT:"updated_at",
      CREATED_BY:"created_by",
      UPDATED_BY:"updated_by"
    }
  };

  module.exports ={
    RECEIPT_MASTER,
    RECEIPT_DETAIL,
    SALESMASTER

  }


 
  
 