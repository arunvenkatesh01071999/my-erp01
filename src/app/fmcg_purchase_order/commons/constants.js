const PURCHASE_ORDER_MASTER = {
    NAME: "purchaseorder_fmcg_master",
    COLUMNS: {
        ID: "id",
        FINANCIAL_YEAR: "financial_year",
        PONO: "pono",
        PODATE: "podate",
        SUPPLIER_ID: "supplier_id",
        EXPIRY_DATE: "expiry_date",
        APPROVAL: "approval",
        UN_APPROVAL_COMMENTS: "un_approval_comments",
        COMPANY_ID: "company_id",
        TOTAL_ITEMS: "total_items",
        TOTAL_ORDER_QTY: "total_order_qty",
        SUB_TOTAL_AMT: "sub_total_amt",
        TOTAL_GST_AMT: "total_gst_amt",
        TOTAL_IGST_AMT: "total_igst_amt",
        TOTAL_CESS_AMT: "total_cess_amt",
        ROFF: "roff",
        GRAND_TOTAL_AMT: "grand_total_amt",
        GRN_NO: "grn_no",
        IS_GRN_COMPLETE: "is_grn_complete",
        PO_TYPE: "po_type",
        MBQ_REF_NO: "mbq_ref_no",
        PO_REF_NO: "po_ref_no",
        EXPIRED: "expired",
        AMENDMENT: "amendment",
        PURCHASE_ORDER_TYPE: "purchase_order_type",
        WH_ID: "wh_id",
        IS_APPROVED_BY: "is_approved_by",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

const PURCHASE_ORDER_DETAILS = {
    NAME: "purchaseorder_fmcg_details",
    COLUMNS: {
        ID: "id",
        PURCHASE_ORDER_MST_ID: "purchase_order_mst_id",
        FINANCIAL_YEAR: "financial_year",
        PONO: "pono",
        PODATE: "podate",
        BALANCE: "balance",
        PROD_ID: "prod_id",
        CAT_ID: "cat_id",
        SUB_CAT_ID: "sub_cat_id",
        HEAD_ID: "head_id",
        TYPE_DESIGN_ID: "type_design_id",
        UOM_ID: "uom_id",
        BARCODE: "barcode",
        MRP: "mrp",
        PURCHASE_RATE: "purchase_rate",
        COST_PRICE: "cost_price",
        QTY: "qty",
        ORDER_QTY: "order_qty",
        AMOUNT: "amount",
        COMPANY_ID: "company_id",
        SUPPLIER_ID: "supplier_id",
        RECEIVED_QTY: "recived_qty",
        RECEIVED_GRN_QTY: "recived_grn_qty",  // Added missing column
        LOOSE_QTY: "loose_qty",
        EXPIRED: "expired",
        IS_GRN_COMPLETE: "is_grn_complete",
        GST_AMOUNT: "gst_amount",
        IGST: "igst",
        GST: "gst",
        CGST: "cgst",
        SGST: "sgst",
        CESS: "cess",
        CESS_AMT: "cess_amt",
        IGST_AMOUNT: "igst_amount",
        CASE_QTY: "case_qty",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

const PURCHASE_ORDER_SETTING = {
    NAME: "purchase_order_setting",
    COLUMNS: {
        ID: "id",
        PURCHASE_ORDER: "purchase_order"
    }
};

module.exports = {
    PURCHASE_ORDER_MASTER,
    PURCHASE_ORDER_DETAILS,
    PURCHASE_ORDER_SETTING
};
