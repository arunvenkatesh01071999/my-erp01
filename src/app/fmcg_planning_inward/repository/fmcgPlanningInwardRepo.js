const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { ITEM } = require("../../catalog/item/commons/constants")
const { PLAN_INWARD_HDR, PLAN_INWARD_DTL, STOCKLEDGER } = require("../commons/constants")


function planningInwardRepo(fastify) {

  async function getFmcgPlanningInwardDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(PLAN_INWARD_HDR.NAME)
      .returning("p_id")
      .orderBy(PLAN_INWARD_HDR.COLUMNS.P_ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Purchase plan inward docno",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { docno: 1 };
    }

    const docno = response[0].p_id;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }
  async function postFmcgPlanningInward({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      // Insert into PRODUCT_PLAN_HDR and get the PP_ID
      const [purchasePlanHdrInsertQuery] = await trx(PLAN_INWARD_HDR.NAME)
        .returning(PLAN_INWARD_HDR.COLUMNS.P_ID)
        .insert({
          [PLAN_INWARD_HDR.COLUMNS.P_DATE]: body.p_date || new Date(),
          [PLAN_INWARD_HDR.COLUMNS.P_YEAR]: financialYear,
          [PLAN_INWARD_HDR.COLUMNS.P_UID]: userDetails.id,
          [PLAN_INWARD_HDR.COLUMNS.P_MUID]: body.p_muid || null,
          [PLAN_INWARD_HDR.COLUMNS.P_COM_ID]: userDetails.company_id,
          [PLAN_INWARD_HDR.COLUMNS.P_REMARK]: body.p_remark || '',
          [PLAN_INWARD_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [PLAN_INWARD_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });


      const purchasePpId = purchasePlanHdrInsertQuery.p_id
      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.plan_inward_details?.length > 0) {
        const planDetailsData = body.plan_inward_details.map(detail => ({
          [PLAN_INWARD_DTL.COLUMNS.PD_ID]: purchasePpId,
          [PLAN_INWARD_DTL.COLUMNS.PD_YEAR]: financialYear || detail.pd_year,
          [PLAN_INWARD_DTL.COLUMNS.PD_DATE]: detail.pd_date || new Date(),
          [PLAN_INWARD_DTL.COLUMNS.PD_SLNO]: detail.pd_slno,
          [PLAN_INWARD_DTL.COLUMNS.PD_PRDID]: detail.pd_prdid,
          [PLAN_INWARD_DTL.COLUMNS.PD_BATCHNO]: detail.pd_batchno,
          [PLAN_INWARD_DTL.COLUMNS.PD_EXPDATE]: detail.pd_expdate,
          [PLAN_INWARD_DTL.COLUMNS.PD_QTY]: detail.pd_qty,
          [PLAN_INWARD_DTL.COLUMNS.PD_COM_ID]: userDetails.company_id,
          [PLAN_INWARD_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PLAN_INWARD_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PLAN_INWARD_DTL.NAME, planDetailsData);
      }



      return { success: true };
    });
  }
  async function updateStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const createdBy = userDetails.id;

      if (body.plan_inward_details?.length > 0) {
        const stockLedgerData = body.plan_inward_details.map(detail => ({
          [STOCKLEDGER.COLUMNS.DATE]: detail.pd_date || new Date(),
          [STOCKLEDGER.COLUMNS.PROD_ID]: detail.pd_prdid,
          [STOCKLEDGER.COLUMNS.PURCHASE_QTY]: detail.pd_qty,
          [STOCKLEDGER.COLUMNS.COMPANY_ID]: companyId,
          [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date(),
          [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
          [STOCKLEDGER.COLUMNS.CREATED_BY]: createdBy,
          [STOCKLEDGER.COLUMNS.UPDATED_BY]: createdBy
        }));

        const chunkSize = 1000; // Adjust based on DB performance

        for (let i = 0; i < stockLedgerData.length; i += chunkSize) {
          const batch = stockLedgerData.slice(i, i + chunkSize);

          await trx.raw(`
                    INSERT INTO ${STOCKLEDGER.NAME} (${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.PURCHASE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID}, ${STOCKLEDGER.COLUMNS.CREATED_AT}, ${STOCKLEDGER.COLUMNS.UPDATED_AT}, ${STOCKLEDGER.COLUMNS.CREATED_BY}, ${STOCKLEDGER.COLUMNS.UPDATED_BY}, ${STOCKLEDGER.COLUMNS.WH_ID})
                    VALUES ${batch.map(d => `('${d.date}', '${d.prod_id}', ${d.purchase_qty}, '${d.company_id}', NOW(), NOW(), '${d.created_by}', '${d.updated_by}','${d.company_id}')`).join(", ")}
                    ON CONFLICT (${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.COMPANY_ID},${STOCKLEDGER.COLUMNS.WH_ID})
                    DO UPDATE SET
                        ${STOCKLEDGER.COLUMNS.PURCHASE_QTY} = ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PURCHASE_QTY} + EXCLUDED.${STOCKLEDGER.COLUMNS.PURCHASE_QTY},
                        ${STOCKLEDGER.COLUMNS.WH_ID} = EXCLUDED.${STOCKLEDGER.COLUMNS.WH_ID},
                        ${STOCKLEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                        ${STOCKLEDGER.COLUMNS.UPDATED_BY} = EXCLUDED.${STOCKLEDGER.COLUMNS.UPDATED_BY}
                `);
        }
      }

      return { success: true };
    });
  }
  async function reduceStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const updatedBy = userDetails.id;
      const ppId = params.planning_inward_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(PLAN_INWARD_DTL.NAME)
        .select(PLAN_INWARD_DTL.COLUMNS.PD_PRDID, PLAN_INWARD_DTL.COLUMNS.PD_QTY)
        .where(PLAN_INWARD_DTL.COLUMNS.PD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[PLAN_INWARD_DTL.COLUMNS.PD_PRDID], 10);
          const purQty = parseFloat(detail[PLAN_INWARD_DTL.COLUMNS.PD_QTY]);

          // Ensure that only valid numbers are processed
          if (isNaN(prodId) || isNaN(purQty)) {
            console.warn("Skipping invalid entry:", detail);
            return null; // Skip invalid rows
          }

          return {
            [STOCKLEDGER.COLUMNS.PROD_ID]: prodId,
            [STOCKLEDGER.COLUMNS.PURCHASE_QTY]: purQty,
            [STOCKLEDGER.COLUMNS.COMPANY_ID]: parseInt(companyId, 10),
            [STOCKLEDGER.COLUMNS.UPDATED_AT]: trx.fn.now(),
            [STOCKLEDGER.COLUMNS.UPDATED_BY]: updatedBy
          };
        }).filter(Boolean); // Remove null values

        if (stockLedgerData.length === 0) {
          console.error("No valid stock ledger data to process.");
          return { success: false, message: "No valid stock data found." };
        }

        // Construct VALUES clause only with valid numbers
        const valuesClause = stockLedgerData
          .map(d => `(${d[STOCKLEDGER.COLUMNS.PROD_ID]}, ${d[STOCKLEDGER.COLUMNS.PURCHASE_QTY]}, ${d[STOCKLEDGER.COLUMNS.COMPANY_ID]})`)
          .join(", ");

        await trx.raw(`
                UPDATE ${STOCKLEDGER.NAME}
                SET 
                    ${STOCKLEDGER.COLUMNS.PURCHASE_QTY} = 
                        CASE 
                            WHEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PURCHASE_QTY} - subquery.${STOCKLEDGER.COLUMNS.PURCHASE_QTY} >= 0 
                            THEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PURCHASE_QTY} - subquery.${STOCKLEDGER.COLUMNS.PURCHASE_QTY}
                            ELSE 0
                        END,
                    ${STOCKLEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                    ${STOCKLEDGER.COLUMNS.UPDATED_BY} = ?
                FROM (
                    VALUES ${valuesClause}
                ) AS subquery(${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.PURCHASE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID})
                WHERE ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PROD_ID} = subquery.${STOCKLEDGER.COLUMNS.PROD_ID}
                AND ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.COMPANY_ID} = subquery.${STOCKLEDGER.COLUMNS.COMPANY_ID};
            `, [updatedBy]);
      }

      return { success: true };
    });
  }
  async function putFmcgPlanningInward({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.planning_inward_id;

      // Update PRODUCT_PLAN_HDR instead of inserting a new record
      await trx(PLAN_INWARD_HDR.NAME)
        .where(PLAN_INWARD_HDR.COLUMNS.P_ID, purchasePpId)
        .update({
          [PLAN_INWARD_HDR.COLUMNS.P_DATE]: body.p_date || new Date(),
          [PLAN_INWARD_HDR.COLUMNS.P_YEAR]: financialYear,
          [PLAN_INWARD_HDR.COLUMNS.P_UID]: userDetails.id,
          [PLAN_INWARD_HDR.COLUMNS.P_MUID]: body.p_muid || null,
          [PLAN_INWARD_HDR.COLUMNS.P_COM_ID]: userDetails.company_id,
          [PLAN_INWARD_HDR.COLUMNS.P_REMARK]: body.p_remark || '',
          [PLAN_INWARD_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });


      // DELETE existing records for this PP_ID before inserting new ones

      await trx(PLAN_INWARD_DTL.NAME).where(PLAN_INWARD_DTL.COLUMNS.PD_ID, purchasePpId).del();

      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }


      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.product_plan_details?.length > 0) {
        const planDetailsData = body.product_plan_details.map(detail => ({
          [PLAN_INWARD_DTL.COLUMNS.PD_ID]: purchasePpId,
          [PLAN_INWARD_DTL.COLUMNS.PD_YEAR]: financialYear || detail.pd_year,
          [PLAN_INWARD_DTL.COLUMNS.PD_DATE]: detail.pd_date || new Date(),
          [PLAN_INWARD_DTL.COLUMNS.PD_SLNO]: detail.pd_slno,
          [PLAN_INWARD_DTL.COLUMNS.PD_PRDID]: detail.pd_prdid,
          [PLAN_INWARD_DTL.COLUMNS.PD_BATCHNO]: detail.pd_batchno,
          [PLAN_INWARD_DTL.COLUMNS.PD_EXPDATE]: detail.pd_expdate,
          [PLAN_INWARD_DTL.COLUMNS.PD_QTY]: detail.pd_qty,
          [PLAN_INWARD_DTL.COLUMNS.PD_COM_ID]: userDetails.company_id,
          [PLAN_INWARD_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PLAN_INWARD_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PLAN_INWARD_DTL.NAME, planDetailsData);
      }

      return { success: true };
    });
  }
  async function getFmcgPlanningInward({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PLAN_INWARD_HDR.NAME}.*`
      ])
      .from(`${PLAN_INWARD_HDR.NAME}`)
      .orderBy(`${PLAN_INWARD_HDR.NAME}.${PLAN_INWARD_HDR.COLUMNS.P_ID}`, "DESC");


    if (!from_date == '') {
      query.whereRaw(
        `DATE(${PLAN_INWARD_HDR.NAME}.${PLAN_INWARD_HDR.COLUMNS.P_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${PLAN_INWARD_HDR.NAME}.${PLAN_INWARD_HDR.COLUMNS.P_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Planning Inward Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Planning Issue Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const plan_inward_details = await knex
          .select([
            `${PLAN_INWARD_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PLAN_INWARD_DTL.NAME} as ${PLAN_INWARD_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PLAN_INWARD_DTL.NAME}.${PLAN_INWARD_DTL.COLUMNS.PD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PLAN_INWARD_DTL.NAME}.${PLAN_INWARD_DTL.COLUMNS.PD_ID}`, offers.p_id);


        return { ...offers, plan_inward_details };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getFmcgPlanningInwardInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PLAN_INWARD_HDR.NAME}.*`
      ])
      .from(`${PLAN_INWARD_HDR.NAME}`)
      .where(`${PLAN_INWARD_HDR.NAME}.${PLAN_INWARD_HDR.COLUMNS.P_ID}`, params.planning_inward_id);
    ;



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Planning Inward Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Planning Issue Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const plan_inward_details = await knex
          .select([
            `${PLAN_INWARD_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PLAN_INWARD_DTL.NAME} as ${PLAN_INWARD_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PLAN_INWARD_DTL.NAME}.${PLAN_INWARD_DTL.COLUMNS.PD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PLAN_INWARD_DTL.NAME}.${PLAN_INWARD_DTL.COLUMNS.PD_ID}`, offers.p_id);


        return { ...offers, plan_inward_details };
      })
    );


    return responsewith_details[0];
  }

  async function deleteFmcgPlanningInwardInfo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.planning_inward_id;
      // DELETE existing records for this P_ID  
      const query1 = trx(PLAN_INWARD_HDR.NAME).where(PLAN_INWARD_HDR.COLUMNS.P_ID, purchasePpId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete product plan header",
        logTrace
      });
      const query2 = trx(PLAN_INWARD_DTL.NAME).where(PLAN_INWARD_DTL.COLUMNS.PD_ID, purchasePpId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete product plan inward detail",
        logTrace
      });
      return { success: true };
    });
  }

  return {
    postFmcgPlanningInward,
    putFmcgPlanningInward,
    updateStockLedger,
    reduceStockLedger,
    planningInwardRepo,
    getFmcgPlanningInward,
    getFmcgPlanningInwardInfo,
    deleteFmcgPlanningInwardInfo,
    getFmcgPlanningInwardDocno
  };
}

module.exports = planningInwardRepo
