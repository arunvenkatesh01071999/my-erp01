const { StatusCodes } = require("http-status-codes");
const { logQuery } = require("../../commons/helpers");
const { PLANNING_FV_HDR, PLANNING_FV_DTL } = require("../commons/constants");
const { ITEM } = require("../../catalog/item/commons/constants");
const { CustomError } = require("../../errorHandler");
const { UNITS } = require("../../catalog/units/commons/constants");

function fnvPackingPlanningRepo(fastify) {
  async function getPackingPlanningDocno({ logTrace }) {
    const knex = this;

    const query = knex(PLANNING_FV_HDR.NAME)
      .returning("id")
      .orderBy(PLANNING_FV_HDR.COLUMNS.ID, "desc")
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Fnv Packing Planning docno",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { docno: 1 };
    }

    const docno = response[0].id;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }

  async function getAllBulkParentItem({ logTrace }) {
    const knex = this;
    const query = knex(ITEM.NAME)
      .select([
        ITEM.COLUMNS.ID,
        ITEM.COLUMNS.PRODUCT_CODE,
        ITEM.COLUMNS.PRODUCT_NAME,
        ITEM.COLUMNS.PRO_DESCRIPTION,
        ITEM.COLUMNS.BULK_ITEM,
        ITEM.COLUMNS.PARENT_PRODUCT_ID
      ])
      .where(ITEM.COLUMNS.BULK_ITEM, true)
      .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get All Bulk Parent Products",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function getChildItemByParentId({ parentId, logTrace }) {
    const knex = this;
    const query = knex(`${ITEM.NAME} as ${ITEM.NAME}`)
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRO_DESCRIPTION}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_WEIGHT}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
      ])
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${ITEM.NAME}.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`, parentId);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Child Products By Parent ID",
      logTrace
    });
    const response = await query;
    if (response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Child Item not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getAllPackingPlanning({ queryString, logTrace, params }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PLANNING_FV_HDR.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`
      ])
      .from(`${PLANNING_FV_HDR.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_FV_HDR.NAME}.${PLANNING_FV_HDR.COLUMNS.PL_PROD_ID}`
      )

    if (!from_date == '') {
      query.whereRaw(
        `DATE(${PLANNING_FV_HDR.NAME}.${PLANNING_FV_HDR.COLUMNS.PL_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${PLANNING_FV_HDR.NAME}.${PLANNING_FV_HDR.COLUMNS.PL_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get All Packing Planning Records with Header and Detail",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Packing Planning data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;

  }

  async function getPackingPlanningById({ params, logTrace }) {
    const knex = this;
    const { id } = params;

    // Build header query
    const headerQuery = knex
      .select(
        `${PLANNING_FV_HDR.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as parent_product_name`,
      )
      .from(PLANNING_FV_HDR.NAME)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_FV_HDR.NAME}.${PLANNING_FV_HDR.COLUMNS.PL_PROD_ID}`
      )
      .where(`${PLANNING_FV_HDR.NAME}.id`, id)
      .first();

    logQuery({
      logger: fastify.log,
      query: headerQuery,
      context: "Get Packing Planning Header By ID",
      logTrace
    });

    const header = await headerQuery;
    if (!header) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Build details query
    const detailQuery = knex
      .select(`
        ${PLANNING_FV_DTL.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as uom_name`
      )
      .from(PLANNING_FV_DTL.NAME)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_FV_DTL.NAME}.${PLANNING_FV_DTL.COLUMNS.PL_PROD_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${PLANNING_FV_DTL.NAME}.pl_hdr_id`, id);

    logQuery({
      logger: fastify.log,
      query: detailQuery,
      context: "Get Packing Planning Details By Header ID",
      logTrace
    });

    const details = await detailQuery;

    return {
      ...header,
      details
    };
  }

  async function postPackingPlanning({
    params,
    body,
    logTrace,
    userDetails,
    financialYear
  }) {
    const knex = this;

    return knex.transaction(async trx => {
      const now = new Date();

      // Insert into PLANNING_FV_HDR
      const [planningHdrInsertQuery] = await trx(PLANNING_FV_HDR.NAME)
        .returning(PLANNING_FV_HDR.COLUMNS.ID)
        .insert({
          [PLANNING_FV_HDR.COLUMNS.PL_YEAR]: financialYear,
          [PLANNING_FV_HDR.COLUMNS.PL_COM_ID]: userDetails.company_id,
          [PLANNING_FV_HDR.COLUMNS.PL_DATE]: body.pl_date || now,
          [PLANNING_FV_HDR.COLUMNS.PL_BATCH_NO]: body.pl_batchno,
          [PLANNING_FV_HDR.COLUMNS.PL_PROD_ID]: body.pl_prodid,
          [PLANNING_FV_HDR.COLUMNS.PL_QTY]: body.pl_qty,
          [PLANNING_FV_HDR.COLUMNS.PL_GRN_NO]: body.pl_grnno,
          [PLANNING_FV_HDR.COLUMNS.IS_ACTIVE]: body.pl_flag,
          [PLANNING_FV_HDR.COLUMNS.PL_GRN_QTY]: body.pl_grnqty,
          [PLANNING_FV_HDR.COLUMNS.PL_PRE_QTY]: body.pl_preqty,
          [PLANNING_FV_HDR.COLUMNS.PL_BAL_DTL]: body.pl_baldtl,
          [PLANNING_FV_HDR.COLUMNS.PL_TOT_WEIGHT]: body.pl_totweight,
          [PLANNING_FV_HDR.COLUMNS.PL_PACK_TYPE]: body.pl_packtype,
          [PLANNING_FV_HDR.COLUMNS.PL_PACKED_QTY]: body.pl_packedqty,
          [PLANNING_FV_HDR.COLUMNS.CREATED_AT]: now,
          [PLANNING_FV_HDR.COLUMNS.CREATED_BY]: userDetails.id,
        });

      const planningHeaderId = planningHdrInsertQuery.id;
      const docno = planningHdrInsertQuery.id;

      // Step 2: Update `PLANNING_FV_HDR` to add the generated document number
      await trx(`${PLANNING_FV_HDR.NAME}`)
        .where(`${PLANNING_FV_HDR.COLUMNS.ID}`, planningHeaderId)
        .update({ [PLANNING_FV_HDR.COLUMNS.DOCNO]: docno });

      // Insert into PLANNING_FV_DTL
      if (
        Array.isArray(body.planning_details) &&
        body.planning_details.length > 0
      ) {
        const planningDetails = body.planning_details.map(detail => ({
          [PLANNING_FV_DTL.COLUMNS.PL_HDR_ID]: planningHeaderId,
          [PLANNING_FV_DTL.COLUMNS.PD_YEAR]: financialYear,
          [PLANNING_FV_DTL.COLUMNS.PD_COM_ID]: userDetails.company_id,
          [PLANNING_FV_DTL.COLUMNS.PL_PROD_ID]: detail.pl_prodid,
          [PLANNING_FV_DTL.COLUMNS.PL_QTY]: detail.pl_qty,
          [PLANNING_FV_DTL.COLUMNS.PD_WEIGHT]: detail.pd_weight,
          [PLANNING_FV_DTL.COLUMNS.CREATED_AT]: now,
          [PLANNING_FV_DTL.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(PLANNING_FV_DTL.NAME).insert(planningDetails);
      }

      return { success: true, pl_hdr_id: planningHeaderId };
    });
  }

  async function updatePackingPlanning({
    params,
    body,
    logTrace,
    userDetails,
    financialYear
  }) {
    const knex = this;

    return knex.transaction(async trx => {
      const now = new Date();
      const plId = params.id;

      const headerRecord = await trx(PLANNING_FV_HDR.NAME)
        .select(PLANNING_FV_HDR.COLUMNS.ID)
        .where(PLANNING_FV_HDR.COLUMNS.ID, plId)
        .first();

      if (!headerRecord) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Planning header Id not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const planningHeaderId = headerRecord.id;

      await trx(PLANNING_FV_HDR.NAME)
        .where(PLANNING_FV_HDR.COLUMNS.ID, planningHeaderId)
        .update({
          [PLANNING_FV_HDR.COLUMNS.PL_YEAR]: financialYear,
          [PLANNING_FV_HDR.COLUMNS.PL_COM_ID]: userDetails.company_id,
          [PLANNING_FV_HDR.COLUMNS.PL_DATE]: body.pl_date || now,
          [PLANNING_FV_HDR.COLUMNS.PL_BATCH_NO]: body.pl_batchno,
          [PLANNING_FV_HDR.COLUMNS.PL_PROD_ID]: body.pl_prodid,
          [PLANNING_FV_HDR.COLUMNS.PL_QTY]: body.pl_qty,
          [PLANNING_FV_HDR.COLUMNS.PL_GRN_NO]: body.pl_grnno,
          [PLANNING_FV_HDR.COLUMNS.IS_ACTIVE]: body.pl_flag,
          [PLANNING_FV_HDR.COLUMNS.PL_GRN_QTY]: body.pl_grnqty,
          [PLANNING_FV_HDR.COLUMNS.PL_PRE_QTY]: body.pl_preqty,
          [PLANNING_FV_HDR.COLUMNS.PL_BAL_DTL]: body.pl_baldtl,
          [PLANNING_FV_HDR.COLUMNS.PL_TOT_WEIGHT]: body.pl_totweight,
          [PLANNING_FV_HDR.COLUMNS.PL_PACK_TYPE]: body.pl_packtype,
          [PLANNING_FV_HDR.COLUMNS.PL_PACKED_QTY]: body.pl_packedqty,
          [PLANNING_FV_HDR.COLUMNS.UPDATED_AT]: new Date(),
          [PLANNING_FV_HDR.COLUMNS.UPDATED_BY]: userDetails.id
        });

      await trx(PLANNING_FV_DTL.NAME)
        .where(PLANNING_FV_DTL.COLUMNS.PL_HDR_ID, planningHeaderId)
        .del();

      if (
        Array.isArray(body.planning_details) &&
        body.planning_details.length > 0
      ) {
        const planningDetails = body.planning_details.map(detail => ({
          [PLANNING_FV_DTL.COLUMNS.PL_HDR_ID]: planningHeaderId,
          [PLANNING_FV_DTL.COLUMNS.PD_YEAR]: financialYear,
          [PLANNING_FV_DTL.COLUMNS.PD_COM_ID]: userDetails.company_id,
          [PLANNING_FV_DTL.COLUMNS.PL_PROD_ID]: detail.pl_prodid,
          [PLANNING_FV_DTL.COLUMNS.PL_QTY]: detail.pl_qty,
          [PLANNING_FV_DTL.COLUMNS.PD_WEIGHT]: detail.pd_weight,
          [PLANNING_FV_DTL.COLUMNS.UPDATED_AT]: now,
          [PLANNING_FV_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await trx(PLANNING_FV_DTL.NAME).insert(planningDetails);
      }

      return { success: true };
    });
  }

  return {
    getAllBulkParentItem,
    getChildItemByParentId,
    postPackingPlanning,
    updatePackingPlanning,
    getPackingPlanningDocno,
    getAllPackingPlanning,
    getPackingPlanningById
  };
}

module.exports = fnvPackingPlanningRepo;
