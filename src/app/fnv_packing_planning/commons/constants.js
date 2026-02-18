const PLANNING_FV_HDR = {
  NAME: "planningfvhdr",
  COLUMNS: {
    ID: "id",
    PL_YEAR: "pl_year",
    DOCNO: "docno",
    PL_COM_ID: "pl_comid",
    PL_DATE: "pl_date",
    PL_BATCH_NO: "pl_batchno",
    PL_PROD_ID: "pl_prodid",
    PL_QTY: "pl_qty",
    PL_GRN_NO: "pl_grnno",
    IS_ACTIVE: "is_active",
    PL_GRN_QTY: "pl_grnqty",
    PL_PRE_QTY: "pl_preqty",
    PL_BAL_DTL: "pl_baldtl",
    PL_TOT_WEIGHT: "pl_totweight",
    PL_PACK_TYPE: "pl_packtype",
    PL_PACKED_QTY: "pl_packedqty",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

const PLANNING_FV_DTL = {
  NAME: "planningfvdtl",
  COLUMNS: {
    ID: "id",
    PL_HDR_ID: "pl_hdr_id",
    PD_YEAR: "pd_year",
    PD_COM_ID: "pd_comid",
    PL_PROD_ID: "pl_prodid",
    PL_QTY: "pl_qty",
    PD_WEIGHT: "pd_weight",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by"
  }
};

module.exports = { PLANNING_FV_HDR, PLANNING_FV_DTL };
