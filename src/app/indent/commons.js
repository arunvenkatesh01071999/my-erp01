const INDENT_MASTER = {
    NAME: "indent_master",
    COLUMNS: {
        ID: "id",
        INDENT_NO: "indent_no",
        INDENT_DATE: "indent_date",
        WH_ID: "wh_id",
        TOTAL_ITEMS: "total_items",
        TOTAL_ORDER_QTY: "total_order_qty",
        TOTAL_AMT: "total_amt",
        TOTAL_GST: "total_gst",
        IS_APPROVED: "is_approved",
        IS_APPROVED_BY: "is_approved_by",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        MANUAL_FLAG: "manual_flag",
        AUTO_FLAG: "auto_flag",
        IS_TRANSFER: "is_transfer",
        OUTLET_ID: "outlet_id",
        COMPANY_ID: "company_id"

    }
};

const INDENT_DETAILS = {
    NAME: "indent_details",
    COLUMNS: {
        ID: "id",
        INDENT_MST_ID: "indent_mst_id",
        INDENT_NO: "indent_no",
        INDENT_DATE: "indent_date",
        PROD_ID: "prod_id",
        MRP: "mrp",
        GST: "gst",
        ORDER_QTY: "order_qty",
        TOTAL_QTY: "total_qty",
        CAT_ID: "cat_id",
        SUB_CAT_ID: "sub_cat_id",
        HEAD_ID: "head_id",
        TYPE_DESIGN_ID: "type_design_id",
        UOM_ID: "uom_id",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at"
    }
};

module.exports = {
    INDENT_MASTER,
    INDENT_DETAILS
};
