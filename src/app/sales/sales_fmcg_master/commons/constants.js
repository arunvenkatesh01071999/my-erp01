const SALES_FMCG_MASTER = {
    NAME: "sales_fmcg_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        CUSTOMER_TYPE: "customer_type",
        CUSTOMER_ID: "customer_id",
        TOTAL_AMOUNT: "total_amount",
        DISCOUNT: "discount",
        GRAND_TOTAL: "grand_total",
        TEMP_GRAND_TOTAL: "temp_grand_total",
        ROFF: "roff",
        PAID: "paid",
        SALES_TYPE: "sales_type",
        STATUS: "status",
        RETURN_AMOUNT: "return_amount",
        COMPANY_ID: "company_id",
        PO_NO: "po_no",
        PO_DATE: "po_date",
        LR_NO: "lr_no",
        LR_DATE: "lr_date",
        TRANSPORT: "transport",
        DELIVERY_BY: "delivery_by",
        PG_TOTAL: "pg_total",
        OTHER_CHARGES: "other_charges",
        TOTAL_GST_AMOUNT: "total_gst_amount",
        TOTAL_IGST_AMOUNT: "total_igst_amount",
        ADVANCE: "advance",
        DELETE_STATUS: "deleted_status",
        CESS_AMT: "cess_amt",
        REMARK: "remark",
        EXPORT_PENDING: "export_pending",
        DELIVERY_DATE: "delivery_date",
        PERFIX: "perfix",
        AUTO_GEN_ID: "auto_gen_id",
        MAIL_ID: "mail_id",
        INDENT_ID: "indent_id",
        EXP_USER_ID: "exp_user_id",
        EXP_DATE: "exp_date",
        MSUID: "msuid",
        MSDOCID: "msdocid",
        MSDATE: "msdate",
        MOBILE_EXPORT: "mobile_export",
        EINVOICE: "einvoice",
        AKNO: "akno",
        AK_DATE: "ak_date",
        IRNNO: "irnno",
        VERIFY: "verify",
        VERIFY_USER_ID: "verify_user_id",
        EWAY: "eway",
        EWAY_NO: "eway_no",
        EWAY_DATE: "eway_date",
        EWAY_VALID_DATE: "eway_valid_date",
        EWAY_INVOICE_PATH: "eway_invoice_path",
        EWAY_PATH: "eway_path",
        EXPORT_PENDING_SCHEDULING: "export_pending_scheduling",
        WH_ID: "wh_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const SALES_FMCG_DETAILS = {
    NAME: "sales_fmcg_details",
    COLUMNS: {
        ID: "id",
        SALES_MASTER_ID: "sales_master_id",
        FINANCIAL_YEAR: "financial_year",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PRODID: "prodid",
        PRO_CODE: "pro_code",
        CATEGORY_ID: "category_id",
        UOM_ID: "uom_id",
        BATCH_NO: "batch_no",
        EXPIRY_DATE: "expiry_date",
        QTY: "qty",
        FREE_QTY: "free_qty",
        TEMP_SALE_QTY: "temp_sale_qty",
        DIS_PER: "dis_per",
        DIS_AMT: "dis_amt",
        VAT: "vat",
        VAT_AMT: "vat_amt",
        RATE: "rate",
        AMOUNT: "amount",
        COMPANY_ID: "company_id",
        PRATE: "prate",
        PAMOUNT: "pamount",
        TYPE_ID: "type_id",
        GST: "gst",
        GST_AMOUNT: "gst_amount",
        IGST: "igst",
        IGST_AMOUNT: "igst_amount",
        CGST: "cgst",
        SGST: "sgst",
        CESS: "cess",
        CESS_AMT: "cess_amt",
        GROSS_QTY: "gross_qty",
        PACK_ID: "pack_id",
        MANUFACTURE_DATE: "manufacture_date",
        EXPIRY_ID: "expiry_id",
        EXPIRY_VALUE: "expiry_value",
        MRP: "mrp",
        AUTO_BATCH: "auto_batch",
        OUTLET_RATE: "outlet_rate",
        INDENT: "indent",
        INDENT_DATE: "indent_date",
        INDENT_QTY: "indent_qty",
        ALTER_UOM_ID: "alter_uom_id",
        ALTER_QTY: "alter_qty",
        ALTER_CONTAIN: "alter_contain",
        ALTER_RATE: "alter_rate",
        BARCODE: "barcode",
        PICKER_ID: "picker_id",
        GROSS_ALTER_ID: "gross_alter_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const SALES_FMCG_TRAY_DETAILS = {
    NAME: "sales_fmcg_tray_details",
    COLUMNS: {
        ID: "id",
        SALES_MASTER_ID: "sales_master_id",
        FINANCIAL_YEAR: "financial_year",
        DOCDATE: "docdate",
        TRAY_ID: "tray_id",
        QTY: "qty",
        COMPANY_ID: "company_id",
        CUSTOMER_ID: "customer_id",
        TYPE_ID: "type_id",
        TEMP_TRAY_QTY: "temp_tray_qty"
    }
};

const SALES_RETURN_MASTER = {
    NAME: "sales_return_master",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PARTYCODE: "partycode",
        AMOUNT: "amount",
        SUBTOTAL_AMOUNT: "subtotal_amount",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        ROFF: "roff",
        BILLNO: "billno",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};


const SALES_RETURN_DETAILS = {
    NAME: "sales_return_details",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        SALES_MST_ID: "sales_mst_id",
        PRODID: "prodid",
        DIS_PER: "dis_per",
        DIS_AMT: "dis_amt",
        MRP: "mrp",
        RATE: "rate",
        QTY: "qty",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        BARCODE: "barcode",
        COMPANY_ID: "company_id",
        HEAD_ID: "head_id",
        TYPE_ID: "type_id",
        SUBCAT_ID: "subcat_id",
        CAT_ID: "cat_id",
        UOM_ID: "uom_id",
        IGST_PER: "igst_per",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};
const STOCKLEDGER = {
    NAME: "stockledger",
    COLUMNS: {
        ID: "id",
        DATE: "date",
        PROD_ID: "prod_id",
        PARCHASE_QTY: "purchase_qty",
        SALE_QTY: "sale_qty",
        PURCHASE_RETURN_QTY: "purchase_return_qty",
        WASTAGE_QTY: "wastage_qty",
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

const OUTLETSTOCKLEDGER = {
    NAME: "outlet_stock_ledger",
    COLUMNS: {
        ID: "id",
        DATE: "date",
        PRODID: "prodid",
        OUTLETID: "outletid",
        PARCHASE_QTY: "purchase_qty",
        SALE_QTY: "sale_qty",
        PURCHASE_RETURN_QTY: "purchase_return_qty",
        WASTAGE_QTY: "wastage_qty",
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
const MAIN_CATEGORY = {
    NAME: "main_category",
    COLUMNS: {
        ID: "id",
        CATEGORY_NAME: "category_name",
        CATEGORY_IMAGE: "category_image",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active"
    }
};
const UNITS = {
    NAME: "units",
    COLUMNS: {
        ID: "id",
        UNITS_SHORT_NAME: "units_short_name",
        UNITS_LONG_NAME: "units_long_name",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
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
    SALES_FMCG_MASTER,
    SALES_FMCG_DETAILS,
    STOCKLEDGER,
    OUTLETSTOCKLEDGER,
    SALES_RETURN_MASTER,
    SALES_RETURN_DETAILS,
    MAIN_CATEGORY,
    UNITS,
    SALES_FMCG_TRAY_DETAILS,
    TRAY_LEDGER
};