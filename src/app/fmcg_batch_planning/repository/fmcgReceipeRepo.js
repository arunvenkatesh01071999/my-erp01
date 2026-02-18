const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { ITEM } = require("../../catalog/item/commons/constants")
const { PRODUCT_PLAN_MST, PRODUCT_PLAN_MST_DTL } = require("../commons/constants")


function fmcgReceipeRepo(fastify) {

  async function getReceipeDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(PRODUCT_PLAN_MST.NAME)
      .returning("pmd_id")
      .orderBy(PRODUCT_PLAN_MST.COLUMNS.PMD_ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product plan  docno",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { docno: 1 };
    }

    const docno = response[0].pmd_id;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }
  async function postReceipe({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      // Insert into PRODUCT_PLAN_HDR and get the PP_ID
      const [purchasePlanHdrInsertQuery] = await trx(PRODUCT_PLAN_MST.NAME)
        .returning(PRODUCT_PLAN_MST.COLUMNS.PMD_ID)
        .insert({
          [PRODUCT_PLAN_MST.COLUMNS.COM_ID]: userDetails.company_id,
          [PRODUCT_PLAN_MST.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_MST.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const purchasePpId = purchasePlanHdrInsertQuery.pmd_id
      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.receipe_details?.length > 0) {
        const planDetailsData = body.receipe_details.map(detail => ({
          [PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID]: purchasePpId,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.SRLNO]: detail.pmd_srlno,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.MAT_ID]: detail.pmd_matid,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.QTY]: detail.pmd_qty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.UOM]: detail.pmd_uom,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.FULL_QTY]: detail.pmd_fullqty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.PRD_QTY]: detail.pmd_prdqty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.COM_ID]: userDetails.company_id,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.TEMP]: detail.pmd_temp,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));
        await batchInsertData(PRODUCT_PLAN_MST_DTL.NAME, planDetailsData);
      }



      return { success: true };
    });
  }
  async function putReceipe({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.receipe_id;

      // Update PRODUCT_PLAN_HDR instead of inserting a new record
      await trx(PRODUCT_PLAN_MST.NAME)
        .where(PRODUCT_PLAN_MST.COLUMNS.PMD_ID, purchasePpId)
        .update({
          [PRODUCT_PLAN_MST.COLUMNS.COM_ID]: userDetails.company_id,
          [PRODUCT_PLAN_MST.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_MST.COLUMNS.UPDATED_BY]: userDetails.id,
        });


      // DELETE existing records for this PP_ID before inserting new ones

      await trx(PRODUCT_PLAN_MST_DTL.NAME).where(PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID, purchasePpId).del();

      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }


      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.receipe_details?.length > 0) {
        const planDetailsData = body.receipe_details.map(detail => ({
          [PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID]: purchasePpId,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.SRLNO]: detail.pmd_srlno,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.MAT_ID]: detail.pmd_matid,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.QTY]: detail.pmd_qty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.UOM]: detail.pmd_uom,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.FULL_QTY]: detail.pmd_fullqty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.PRD_QTY]: detail.pmd_prdqty,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.COM_ID]: userDetails.company_id,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.TEMP]: detail.pmd_temp,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_MST_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PRODUCT_PLAN_MST_DTL.NAME, planDetailsData);
      }

      return { success: true };
    });
  }
  async function getReceipe({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PRODUCT_PLAN_MST.NAME}.*`
      ])
      .from(`${PRODUCT_PLAN_MST.NAME}`)
      .orderBy(`${PRODUCT_PLAN_MST.NAME}.${PRODUCT_PLAN_MST.COLUMNS.PMD_ID}`, "DESC");


    if (!from_date == '') {
      query.whereRaw(
        `DATE(${PRODUCT_PLAN_MST.NAME}.${PRODUCT_PLAN_MST.COLUMNS.CREATED_AT}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${PRODUCT_PLAN_MST.NAME}.${PRODUCT_PLAN_MST.COLUMNS.CREATED_AT}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product Plan Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product Plan Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const receipe_details = await knex
          .select([
            `${PRODUCT_PLAN_MST_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_MST_DTL.NAME} as ${PRODUCT_PLAN_MST_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_MST_DTL.NAME}.${PRODUCT_PLAN_MST_DTL.COLUMNS.MAT_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_MST_DTL.NAME}.${PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID}`, offers.pmd_id);


        return { ...offers, receipe_details };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getReceipeInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PRODUCT_PLAN_MST.NAME}.*`
      ])
      .from(`${PRODUCT_PLAN_MST.NAME}`)
      .where(`${PRODUCT_PLAN_MST.NAME}.${PRODUCT_PLAN_MST.COLUMNS.PMD_ID}`, params.receipe_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product Plan Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product plan Master data info  not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const receipe_details = await knex
          .select([
            `${PRODUCT_PLAN_MST_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_MST_DTL.NAME} as ${PRODUCT_PLAN_MST_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_MST_DTL.NAME}.${PRODUCT_PLAN_MST_DTL.COLUMNS.MAT_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_MST_DTL.NAME}.${PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID}`, offers.pmd_id);


        return { ...offers, receipe_details };
      })
    );


    return responsewith_details[0];
  }
  async function deleteReceipe({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.receipe_id;
      // DELETE existing records for this P_ID  
      const query1 = trx(PRODUCT_PLAN_MST.NAME).where(PRODUCT_PLAN_MST.COLUMNS.PMD_ID, purchasePpId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete product plan header",
        logTrace
      });
      const query2 = trx(PRODUCT_PLAN_MST_DTL.NAME).where(PRODUCT_PLAN_MST_DTL.COLUMNS.PMD_ID, purchasePpId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete product plan detail",
        logTrace
      });
      return { success: true };
    });
  }

  return {
    postReceipe,
    putReceipe,
    getReceipe,
    getReceipeInfo,
    deleteReceipe,
    getReceipeDocno
  };
}

module.exports = fmcgReceipeRepo
