const PURCHASE_FMCG_GRN_MASTER = {
    NAME: "purchase_fmcg_grn_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        SUPPLIER_ID: "supplier_id",
        GRAND_TOTAL_AMT: "grand_total_amt",
        SUB_TOTAL_AMT: "sub_total_amt", // Missing field added
        INVOICE_NO: "invoice_no",
        INVOICE_DATE: "invoice_date",
        CUSTOMER_TYPE: "customer_type",
        PONO: "pono",
        PODATE: "podate",
        STATUS: "status",
        TOTAL_ORDER_QTY: "total_order_qty",
        TOTAL_RECEIVED_QTY: "total_received_qty",
        COMPANY_ID: "company_id",
        WAREHOUSE_ID: "warehouse_id",
        REMARK: "remark",
        RETURN_AMOUNT: "return_amount",
        RETURN_REMARK: "return_remark",
        DISCOUNT: "discount",
        VATCSTAMT: "vatcstamt",
        ROFF: "roff",
        OTHER_CHARGES: "other_charges",
        GST_AMT: "total_gst_amt",
        IGST_AMT: "total_igst_amt",
        ADVANCE: "advance",
        CESS_AMT: "total_cess_amt",
        PRODUCT_TYPE: "product_type",
        TCS: "tcs",
        PURCHASE: "purchase",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        IS_ACTIVE: "is_active"
    }
};


const PURCHASE_FMCG_GRN_DETAILS = {
    NAME: "purchase_fmcg_grn_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_GRN_MST_ID: "purchase_grn_mst_id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PO_NO: "po_no",
        PROD_ID: "prod_id",
        PROD_CODE: "prod_code",
        CAT_ID: "cat_id",
        SUB_CAT_ID: "sub_cat_id",
        HEAD_ID: "head_id",
        HSN_CODE: "hsn_code",
        TYPE_DESIGN_ID: "type_design_id",
        UOM_ID: "uom_id",
        BARCODE: "barcode",
        EXPIRY_DATE: "expiry_date",
        ORDER_QTY: "order_qty",
        RECEIVED_QTY: "recived_qty",
        FREE_QTY: "free_qty",
        DISCOUNT: "discount",
        DISCOUNT_AMOUNT: "discount_amount",
        VAT: "vat",
        VAT_AMOUNT: "vat_amount",
        PURCHASE_RATE: "purchase_rate",
        AMOUNT: "amount",
        COMPANY_ID: "company_id",
        SUPPLIER_ID: "supplier_id",
        ACCEPTED_MARGIN: "accepted_margin",
        MRP: "mrp",
        SALE_RATE: "sale_rate",
        GST: "gst",
        GST_AMOUNT: "gst_amount",
        IGST: "igst",
        IGST_AMOUNT: "igst_amount",
        SGST: "sgst",
        CGST: "cgst",
        CESS: "cess",
        CESS_AMOUNT: "cess_amount",
        PACK_FLAG: "pack_flag",
        PACK_QTY: "pack_qty",
        SELF_LIFE_EXPIRY: "self_life_expiry_days",
        RETURN_QTY: "return_qty",
        TRAY_ID: "tray_id",
        TEMP_REC_QTY: "temp_rec_qty",
        TEMP_GRN_RETURN_QTY: "temp_grn_return_qty",
        TRAY_COUNT: "tray_count",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_ACTIVE: "is_actvie",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

const TRAY_MASTER = {
    NAME: "tray_master",
    COLUMNS: {
        ID: "id",
        TRAY_NAME: "tray_name",
        TRAY_WEIGHT: "tray_weight",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PURCHASE_BATCH_DETAILS = {
    NAME: "purchase_batch_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_MASTER_ID: "purchase_master_id",
        PRODUCT_ID: "product_id",
        PRODUCT_CODE: "product_code",
        BATCH_NO: "batch_no",
        QTY: "qty",
        SELF_LIFE_EXPIRY: "self_life_expiry_days",
        RETURN_QTY: "return_qty",
        COMPANY_ID: "company_id",
        MANUFACTURE_DATE: "manufacture_date",
        EXPIRY_ID: "expiry_id",
        EXPIRY_VALUE: "expiry_value",
        EXPIRY_DATE: "expiry_date"
    }
};

const PURCHASE_MASTER_BATCH_DETAILS = {
    NAME: "purchase_master_batch_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_MASTER_ID: "purchase_master_id",
        DOCDATE: "docdate",
        PRODUCT_ID: "product_id",
        PRODUCT_CODE: "product_code",
        BATCH_NO: "batch_no",
        QTY: "qty",
        SELF_LIFE_EXPIRY_DAYS: "self_life_expiry_days",
        RETURN_QTY: "return_qty",
        COMPANY_ID: "company_id",
        MANUFACTURE_DATE: "manufacture_date",
        EXPIRY_ID: "expiry_id",
        EXPIRY_VALUE: "expiry_value",
        EXPIRY_DATE: "expiry_date"
    }
};

const PURCHASE_GRN_TRAY_DETAILS = {
    NAME: "purchase_grn_tray_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_MASTER_ID: "purchase_master_id",
        DOCDATE: "docdate",
        TRAY_ID: "tray_id",
        TRAY_COUNT: "tray_count",
        TEMP_TRAY_QTY: "temp_tray_qty"
    }
};

const PURCHASE_FV_GRN_MASTER = {
    NAME: "purchase_fv_grn_master",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        SUPPLIER_ID: "supplier_id",
        PRODUCT_TYPE: "product_type",
        AMOUNT: "amount",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        ROFF: "roff",
        FREIGHT_CHARGES: "freight_charges",
        OTHER_CHARGES: "other_charges",
        TOTAL_QTY: "total_qty",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        IS_ACTIVE: "is_active"
    }
};


const PURCHASE_GRN_FV_DETAILS = {
    NAME: "purchase_grn_fv_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_GRN_FV_MST_ID: "purchase_grn_fv_mst_id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PROD_ID: "prod_id",
        PROD_CODE: "prod_code",
        CAT_ID: "cat_id",
        SUB_CAT_ID: "sub_cat_id",
        HEAD_ID: "head_id",
        TYPE_DESIGN_ID: "type_design_id",
        UOM_ID: "uom_id",
        BARCODE: "barcode",
        MRP: "mrp",
        GST: "gst",
        CESS: "cess",
        QTY: "qty",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        PURCHASE_RATE: "purchase_rate",
        COMPANY_ID: "company_id",
        IGST_PER: "igst_per"
    }
};


const PURCHASE_FV_TRAY_DETAILS = {
    NAME: "purchase_fv_tray_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_GRN_MST_ID: "purchase_grn_mst_id",
        TRAY_ID: "tray_id",
        TRAY_QTY: "tray_qty"
    }
};


const STOCKLEDGER = {
    NAME: "stockledger",
    COLUMNS: {
        ID: "id",
        DATE: "date",
        PROD_ID: "prod_id",
        PUR_QTY: "purchase_qty",
        SALE_QTY: "sale_qty",
        PUR_RET_QTY: "purchase_return_qty",
        WAS_QTY: "wastage_qty",
        ADJUST_QTY: "adjust_qty",
        FREE_QTY: "free_qty",
        SALES_IN_QTY: "sales_in_qty",
        SALES_RETURN_QTY: "sales_return_qty",
        TR_IN_QTY: "tr_in_qty",
        TR_OUT_QTY: "tr_out_qty",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        WH_ID: "wh_id"
    }
};

const TRAY_LEDGER = {
    NAME: "trayledger",
    COLUMNS: {
        ID: "id",
        DOCDATE: "tl_date",
        CUSTOMER_ID: "tl_custid",
        RECEIVED_QTY: "tl_recqty",
        ISSUED_QTY: "tl_issqty",
        TRAY_ID: "tl_trayid",
        TEMP_TRAY_QTY: "temp_tray_qty",
        WASTE_QTY: "tl_wasteqty",
        OPENING: "tl_opening",
        BALANCE: "tl_balance",
        COMPANY_ID: "tl_comid",
        YEAR: "tl_year",
        TYPE: "tl_type",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
    },
};

module.exports = {
    PURCHASE_FMCG_GRN_MASTER,
    PURCHASE_FMCG_GRN_DETAILS,
    PURCHASE_BATCH_DETAILS,
    PURCHASE_FV_GRN_MASTER,
    PURCHASE_FV_TRAY_DETAILS,
    PURCHASE_GRN_FV_DETAILS,
    STOCKLEDGER,
    TRAY_LEDGER,
    TRAY_MASTER,
    PURCHASE_MASTER_BATCH_DETAILS,
    PURCHASE_GRN_TRAY_DETAILS
};
