const PACKING_PLANNING_MASTER = {
  NAME: "packing_planning_master",
  COLUMNS: {
    ID: "id",
    FINANCIAL_YEAR: "financial_year",
    DOC_NO: "docno",
    DOC_DATE: "docdate",
    PLANNING_TYPE_ID: "planning_type_id",
    COMPANY_ID: "company_id",
    PLANNING_BATCH_NO: "planning_batchno",
    PARENT_PROD_ID: "parent_prod_id",
    PARENT_PROD_QTY: "parent_prod_qty",
    PLANNING_TOTAL_ITEMS: "planning_total_items",
    INDENT_NO: "indent_no",
    PLANNING_TOTAL_WEIGHT: "planning_total_weight",
    IS_ACTIVE: "is_active",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const PACKING_PLANNING_DETAILS = {
  NAME: "packing_planning_details",
  COLUMNS: {
    ID: "id",
    PLANNING_MST_ID: "planning_mst_id",
    FINANCIAL_YEAR: "financial_year",
    COMPANY_ID: "company_id",
    SERIAL_NO: "serial_no",
    PROD_ID: "prod_id",
    QTY: "qty",
    WEIGHT: "weight",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const PURCHASE_DTL = {
  NAME: "purchasedtl",
  COLUMNS: {
    ID: "id",
    YEAR: "pd_year",
    DATE: "pd_date",
    SLNO: "pd_slno",
    PROD_ID: "pd_prdid",
    BATCH_NO: "pd_batchno",
    EXP_DATE: "pd_expdate",
    QTY: "pd_qty",
    FREE: "pd_free",
    DIS: "pd_dis",
    DIS_AMT: "pd_disamt",
    VAT: "pd_vat",
    VAT_AMT: "pd_vatamt",
    RATE: "pd_rate",
    AMT: "pd_amt",
    COM_ID: "pd_comid",
    SUPP_ID: "pd_suppid",
    PONO: "pd_pono",
    A_MARGIN: "pd_amargin",
    SALES_RATE: "pd_salrate",
    MRP: "pd_mrp",
    CGST: "pd_cgst",
    SGST: "pd_sgst",
    CSS: "pd_css",
    CESS_AMT: "pd_cessamt",
    PO_QTY: "pd_poqty",
    PACK_FLAG: "pd_packflag",
    PACK_QTY: "pd_packqty",
    WH_MARGIN: "pd_whmargin",
    SALES_MARGIN: "pd_salesmargin",
    REASON_DN_AMT: "pd_reasondnamt",
    DN_AMT: "pd_dnamt",
    RET_QTY: "pd_retqty",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


const AUTO_MBQ_PO = {
  NAME: "autombqpo",
  COLUMNS: {
    ID: "id",
    DATE: "amp_date",
    PROD_ID: "amp_prdid",
    SUPP_ID: "amp_suppid",
    LOC_ID: "amp_locid",
    MBQ_DAYS: "amp_mbqdays",
    SALES_QTY: "amp_salesqty",
    MBQ: "amp_mbq",
    SOH: "amp_soh",
    PO: "amp_po",
    PO_ID: "amp_poid",
    USER_ID: "amp_uid",
    WH_STOCK: "whstock",
    PO_QTY: "poqty",
    CASE_QTY: "caseqty",
    WH_DAMAGE: "whdamage",
    WH_WASTE: "whwaste",
    WH_SK: "whsk",
    TRANSIT: "amp_transit",
    MDY: "amp_mdy",
    MAX: "amp_max",
    ACTIVE: "amp_active",
    WH_PO: "amp_whpo",
    INDENT: "amp_indent",
    RQD: "amp_rqd",
    AUTO_MANUAL_PO: "amp_automanualpo",
    OUT_PO_NO: "amp_outpono",
    MEMO_NO: "amp_memono",
    APPROVE: "amp_approve",
    MANUAL_PO_NO: "amp_manulpopo",
    STATUS: "amp_status",
    A_QTY: "amp_aqty",
    PACK_QTY: "amp_packqty",
    ST_DAY: "amp_stday",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};


module.exports = {
  PACKING_PLANNING_MASTER,
  PACKING_PLANNING_DETAILS,
  PURCHASE_DTL,
  AUTO_MBQ_PO
};
