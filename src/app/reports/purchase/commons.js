const PURCHASE_MST = {
    NAME: "purchase_master",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PARTYCODE: "partycode",
        AMOUNT: "amount",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        ROFF: "roff",
        FREIGHT_CHARGES: "freight_charges",
        OTHER_CHARGES: "other_charges",
        PONO: "pono",
        PODATE: "podate",
        PARTYDC: "partydc",
        OUTSTANDING: "outstanding",
        PARTYDCDATE: "partydcdate",
        COMPANY_ID: "company_id",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_BARCODE_GENERATED: "is_barcode_generated",
        PRODUCT_TYPE: "product_type",
        WH_ID: "wh_id"

    }
};

const PURCHASE_MST_TEMP = {
    NAME: "purchase_master_temp",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PARTYCODE: "partycode",
        AMOUNT: "amount",
        GST_PER: "gst_per",
        GST_AMT: "gst_amt",
        CESS_PER: "cess_per",
        CESS_AMT: "cess_amt",
        ROFF: "roff",
        FREIGHT_CHARGES: "freight_charges",
        OTHER_CHARGES: "other_charges",
        PONO: "pono",
        PODATE: "podate",
        PARTYDC: "partydc",
        OUTSTANDING: "outstanding",
        PARTYDCDATE: "partydcdate",
        COMPANY_ID: "company_id",
        PRODUCT_TYPE: "product_type",
        IS_ACTIVE: "is_active",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_BARCODE_GENERATED: "is_barcode_generated"

    }
};

const PURCHASE_MST_PONUM = {
    NAME: "purchase_master_ponumbers",
    COLUMNS: {
        ID: "id",
        PURMST_ID: "purmst_id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PONO: "pono",
        PODATE: "podate",
        WH_ID: "wh_id",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by"
    }
};

const PURCHASE_DETAILS = {
    NAME: "purchase_details",
    COLUMNS: {
        ID: "id",
        PURMST_ID: "purmst_id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PROD_ID: "prodid",
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
        HEAD_ID: "head_id",
        TYPE_ID: "type_id",
        SUBCAT_ID: "subcat_id",
        CAT_ID: "cat_id",
        UOM_ID: "uom_id",
        IGST_PER: "igst_per",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_BARCODE_GENERATED_LIST: "is_barcode_generated_list",
        WH_ID: "wh_id"
    }
};

const PURCHASE_DETAILS_TEMP = {
    NAME: "purchase_details_temp",
    COLUMNS: {
        ID: "id",
        PURMST_ID: "purmst_id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PROD_ID: "prodid",
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
        HEAD_ID: "head_id",
        TYPE_ID: "type_id",
        SUBCAT_ID: "subcat_id",
        CAT_ID: "cat_id",
        UOM_ID: "uom_id",
        IGST_PER: "igst_per",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        IS_BARCODE_GENERATED_LIST: "is_barcode_generated_list"
    }
};
const PARTYLEDGER = {
    NAME: "partyledger",
    COLUMNS: {
        ID: "id",
        EDATE: "edate",
        PARTYCODE: "supplierid",
        DEBIT: "debit",
        CREDIT: "credit",
        TYPE: "type",
        MODE: "Mode",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        WH_ID: "wh_id"

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




const PURCHASERETURNMASTER = {
    NAME: "purchase_return_master",
    COLUMNS: {
        ID: "id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PARTYCODE: "partycode",
        AMOUNT: "amount",
        SUBTOTALAMOUNT: "subtotal_amount",
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
        UPDATED_BY: "updated_by",
        WH_ID: "wh_id"

    }
};

const PURCHASERETURNDETAIL = {
    NAME: "purchase_return_detail",
    COLUMNS: {
        ID: "id",
        PRMST_ID: "prmst_id",
        DOCNO: "docno",
        DOCDATE: "docdate",
        PROD_ID: "prod_id",
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
        HEAD_ID: "head_id",
        TYPE_ID: "type_id",
        SUBCAT_ID: "subcat_id",
        CAT_ID: "cat_id",
        UOM_ID: "uom_id",
        IGST_PER: "igst_per",
        COMPANY_ID: "company_id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
        WH_ID: "wh_id"

    }
};


module.exports = {
    PURCHASE_MST,
    PURCHASE_MST_PONUM,
    PURCHASE_DETAILS,
    PARTYLEDGER,
    STOCKLEDGER,
    PURCHASERETURNMASTER,
    PURCHASERETURNDETAIL,
    PURCHASE_MST_TEMP,
    PURCHASE_DETAILS_TEMP
};