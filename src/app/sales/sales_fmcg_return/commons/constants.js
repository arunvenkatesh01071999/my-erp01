const SALES_RETURN_MASTER = {
    NAME: "sales_fmcg_return_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        CUSTOMER_TYPE: "customer_type",
        CUSTOMER_ID: "customer_id",
        SUB_TOTAL_AMOUNT: "sub_total_amount",
        DISCOUNT: "discount",
        GRAND_TOTAL: "grand_total",
        TEMP_GRAND_TOTAL: "temp_grand_total",
        INVOICE_NO: "invoice_no",
        SALES_MASTER_ID: "sales_master_id",
        ROUND_OFF: "round_off",
        SALES_RETURN_TYPE: "sales_return_type",
        APP_FLAG: "app_flag",
        TOTAL_CESS_AMT: "total_cess_amount",
        SALE_TYPE: "sale_type",
        TOTAL_GST_AMOUNT: "total_gst_amount",
        TOTAL_IGST_AMOUNT: "total_igst_amount",
        REMARK: "remark",
        SALES_VERIFY_ID: "sales_verify_id",
        EINVOICE: "einvoice",
        AKNO: "akno",
        AK_DATE: "ak_date",
        IRNNO: "irnno",
        COMPANY_ID: "company_id",
        WAREHOUSE_ID: "warehouse_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    },
};

const SALES_RETURN_DETAILS = {
    NAME: "sales_fmcg_return_details",
    COLUMNS: {
        ID: "id",
        SALES_RETURN_ID: "sales_return_id",
        FINANCIAL_YEAR: "financial_year",
        PRODUCT_ID: "product_id",
        BATCHNO: "batch_no",
        EXP_DATE: "exp_date",
        SALE_TYPE: "sale_type",
        DISCOUNT: "discount",
        DISCOUNT_AMOUNT: "discount_amount",
        MRP: "mrp",
        RATE: "rate",
        GST: "gst",
        CGST: "cgst",
        SGST: "sgst",
        GST_AMOUNT: "gst_amount",
        IGST: "igst",
        IGST_AMOUNT: "igst_amount",
        CESS: "cess",
        CESS_AMOUNT: "cess_amount",
        ACT_QTY: "actual_qty",
        RETURN_QTY: "return_qty",
        TEMP_RETURN_QTY: "temp_return_qty",
        ACT_FREE: "actual_free",
        RETURN_FREE_QTY: "return_free_qty",
        TEMP_DNE_QTY: "temp_dne_qty",
        AMOUNT: "amount",
        WH_STOCK: "wh_stock",
        DNE: "dne",
        REASON: "reason",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};



const STORE_RETURN = {
    NAME: "store_return",
    COLUMNS: {
        ID: "id",
        OUTLET_ID: "outlet_id",
        DOC_ID: "doc_id",
        DOC_DATE: "doc_date",
        BILL_TYPE: "bill_type",
        BILL_NO: "bill_no",
        BILL_DATE: "bill_date",
        SR_ID: "sr_id",
        PROD_CODE: "prod_code",
        SEND_QTY: "send_qty",
        RECD_QTY: "recd_qty",
        REASON: "reason",
        REASON1: "reason1",
        FLAG: "flag",
        STATUS: "status",
        WH_STOCK: "wh_stock",
        DNE: "dne",
        VERIFY_DATE: "verify_date",
        VERIFY_USER: "verify_user",
        REJECT_QTY: "reject_qty",
        RJT_REASON: "rjt_reason",
        BATCH_NO: "batch_no",
        EXP_DATE: "exp_date",
        WID: "wid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const CLOSINGSTOCK = {
    NAME: "closing_stock",
    COLUMNS: {
        ID: "id",
        DOCDATE: "docdate",
        PRODID: "prodid",
        PHYSICAL_QTY: "physical_qty",
        COMPUTER_QTY: "computer_qty",
        PURCHASE_RATE: "purchase_rate",
        SALES_RATE: "sales_rate",
        MRP: "mrp",
        UID: "uid",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const STORE_RETURN_FMCG = {
    NAME: "store_return_fmcg",
    COLUMNS: {
        ID: "id",
        OUTLET_ID: "outlet_id",
        DOC_ID: "doc_id",
        DOC_DATE: "doc_date",
        BILL_TYPE: "bill_type",
        BILL_NO: "bill_no",
        BILL_DATE: "bill_date",
        SR_ID: "sr_id",
        PROD_CODE: "prod_code",
        SEND_QTY: "send_qty",
        STOCK: "stock",
        DE_QTY: "de_qty",
        ACCEPT_QTY: "accept_qty",
        REJECT_QTY: "reject_qty",
        STORE_REASON: "store_reason",
        WH_REASON: "wh_reason",
        RJT_REASON: "rjt_reason",
        FLAG: "flag",
        STATUS: "status",
        WH_STOCK: "wh_stock",
        DNE: "dne",
        VERIFY_DATE: "verify_date",
        VERIFY_USER: "verify_user",
        BATCH_NO: "batch_no",
        EXP_DATE: "exp_date",
        WID: "wid",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PARTY_LEDGER = {
    NAME: "party_ledger",
    COLUMNS: {
        ID: "id",
        PARTY_LEDGER_ID: "pl_id",
        PARTY_LEDGER_DETAIL_ID: "pl_did",
        LEDGER_DATE: "pl_date",
        LEDGER_TYPE: "pl_type",
        LEDGER_NUMBER: "pl_no",
        LEDGER_MODE: "pl_mode",
        CHEQUE_NUMBER: "pl_chequeno",
        CHEQUE_DATE: "pl_cdate",
        CREDIT_AMOUNT: "pl_credit",
        DEBIT_AMOUNT: "pl_debit",
        REMARKS: "pl_remarks",
        PL_WH_ID: "pl_wh_id",
        PAYMENT_TYPE: "pl_pttyp",
        COMPANY_ID: "pl_comid",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

module.exports = {
    SALES_RETURN_MASTER,
    SALES_RETURN_DETAILS,
    STORE_RETURN,
    CLOSINGSTOCK,
    PARTY_LEDGER,
    STORE_RETURN_FMCG
};