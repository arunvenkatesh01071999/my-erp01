const SALES_RETURN = {
    NAME: "sales_fmcg_return_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        CUSTOMER_ID: "customer_id",
        TOTAL: "total",
        DISCOUNT: "discount",
        VATCSTAMT: "vat_cst_amt",
        GRAND_TOTAL: "grand_total",
        INVOICE_NO: "invoice_no",
        SALES_DOC_ID: "sales_doc_id",
        ROUND_OFF: "round_off",
        TYPE: "type",
        APP_FLAG: "app_flag",
        CESS_AMT: "cess_amt",
        SALE_TYPE: "sale_type",
        GST: "gst",
        IGST: "igst",
        REMARK: "remark",
        VERIFYID: "verify_id",
        EINVOICE: "einvoice",
        AKNO: "akno",
        AK_DATE: "ak_date",
        IRNNO: "irnno",
        COMPANY_ID: "company_id",
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
        ACT_QTY: "act_qty",
        QTY: "qty",
        ACT_FREE: "act_free",
        FREE: "free",
        DISCOUNT: "discount",
        DISCOUNT_AMOUNT: "discount_amount",
        VAT: "vat",
        VAT_AMOUNT: "vat_amount",
        RATE: "rate",
        AMOUNT: "amount",
        SUPPLIER_ID: "supplier_id",
        REASON: "reason",
        CGST: "cgst",
        SGST: "sgst",
        CESS: "cess",
        CESS_AMT: "cess_amt",
        SALE_TYPE: "sale_type",
        MRP: "mrp",
        WH_STOCK: "wh_stock",
        DNE: "dne",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    },
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





module.exports = {
    SALES_RETURN,
    SALES_RETURN_DETAILS,
    STORE_RETURN,
    CLOSINGSTOCK
};