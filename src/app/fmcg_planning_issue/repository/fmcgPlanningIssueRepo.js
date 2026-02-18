const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { SUPPLIER, ITEM, VENDORS_MAPPING, BARCODE_LIST } = require("../../catalog/item/commons/constants")
const { PURCHASE_ORDER_MASTER, PURCHASE_ORDER_DETAILS, PURCHASE_ORDER_SETTING } = require("../commons/constants")
const { STATES, COUNTRIES, CITIES } = require("../../masterData/commons/constants")
const { USERS } = require("../../accounts/admin/commons/constants")
const { PRODUCT_PLAN_HDR, PRODUCT_PLAN_DTL, PRODUCT_PLAN_REQ, STOCKLEDGER } = require("../commons/constants")


function planningIssueRepo(fastify) {

  async function getFmcgPlanningIssueDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(PRODUCT_PLAN_HDR.NAME)
      .returning("id")
      .orderBy(PRODUCT_PLAN_HDR.COLUMNS.PP_ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Purchase plan header docno",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { docno: 1 };
    }

    const docno = response[0].pp_id;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }
  // async function postFmcgPlanningIssue({ params, body, logTrace, userDetails, financialYear }) {
  //   const knex = this;
  //   const purchasePlanHdrData = {
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_DATE]: body.pp_date || new Date(),
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_TIME]: body.pp_time || new Date(),
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_KIT_ISS_MST]: body.pp_kitissmst || '',
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_UID]: userDetails.id,
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_CID]: userDetails.company_id,
  //     [PRODUCT_PLAN_HDR.COLUMNS.PP_YEAR]: financialYear,
  //     [PRODUCT_PLAN_HDR.COLUMNS.CREATED_BY]: userDetails.id,
  //     [PRODUCT_PLAN_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
  //   };

  //   const purchasePlanHdrInsertQuery = await knex(PRODUCT_PLAN_HDR.NAME)
  //     .returning(PRODUCT_PLAN_HDR.COLUMNS.PP_ID)
  //     .insert(purchasePlanHdrData);

  //   const purchasePpId = purchasePlanHdrInsertQuery[0].pp_id;

  //   if (body.product_plan_details && body.product_plan_details.length > 0) {
  //     for (const detail of body.plan_details) {
  //       const planDetailsData = {
  //         [PRODUCT_PLAN_DTL.COLUMNS.PPD_ID]: purchasePpId,
  //         [PRODUCT_PLAN_DTL.COLUMNS.SERIAL_NO]: detail.ppd_srlno,
  //         [PRODUCT_PLAN_DTL.COLUMNS.MATERIAL_ID]: detail.ppd_matid,
  //         [PRODUCT_PLAN_DTL.COLUMNS.QUANTITY]: detail.ppd_qty,
  //         [PRODUCT_PLAN_DTL.COLUMNS.TIN]: detail.ppd_tin,
  //         [PRODUCT_PLAN_DTL.COLUMNS.CID]: userDetails.company_id,
  //         [PRODUCT_PLAN_DTL.COLUMNS.YEAR]: financialYear,
  //         [PRODUCT_PLAN_DTL.COLUMNS.CREATED_BY]: userDetails.id,
  //         [PRODUCT_PLAN_DTL.COLUMNS.UPDATED_BY]: userDetails.id
  //       };

  //       await knex(PRODUCT_PLAN_DTL.NAME)
  //         .insert(planDetailsData);
  //     }
  //   }

  //   if (body.product_plan_requests && body.product_plan_requests.length > 0) {
  //     for (const detail of body.plan_requests) {
  //       const planRequestsData = {
  //         [PRODUCT_PLAN_REQ.COLUMNS.PPR_ID]: purchasePpId,
  //         [PRODUCT_PLAN_REQ.COLUMNS.SERIAL_NO]: detail.ppr_srlno,
  //         [PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID]: detail.ppr_matid,
  //         [PRODUCT_PLAN_REQ.COLUMNS.QUANTITY]: detail.ppr_qty,
  //         [PRODUCT_PLAN_REQ.COLUMNS.AVAILABLE_QUANTITY]: detail.ppr_availqty,
  //         [PRODUCT_PLAN_REQ.COLUMNS.COST]: detail.ppr_cost,
  //         [PRODUCT_PLAN_REQ.COLUMNS.CID]: userDetails.company_id,
  //         [PRODUCT_PLAN_REQ.COLUMNS.YEAR]: financialYear,
  //         [PRODUCT_PLAN_REQ.COLUMNS.CREATED_BY]: userDetails.id,
  //         [PRODUCT_PLAN_REQ.COLUMNS.UPDATED_BY]: userDetails.id
  //       };

  //       await knex(PRODUCT_PLAN_REQ.NAME)
  //         .insert(planRequestsData);
  //     }
  //   }

  //   return { success: true };
  // }
  // async function reduceStockLedger({ params, body, logTrace, userDetails, financialYear }) {
  //   const knex = this;

  //   return knex.transaction(async trx => {
  //     const companyId = userDetails.company_id;
  //     const updatedBy = userDetails.id;
  //     const ppId = params.planning_issue_id;

  //     // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
  //     const productPlanRequests = await trx(PRODUCT_PLAN_REQ.NAME)
  //       .select(PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID, PRODUCT_PLAN_REQ.COLUMNS.QUANTITY)
  //       .where(PRODUCT_PLAN_REQ.COLUMNS.PPR_ID, ppId);

  //     if (productPlanRequests.length > 0) {
  //       for (const detail of productPlanRequests) {
  //         const materialId = parseInt(detail.MATERIAL_ID);
  //         const quantityToReduce = parseFloat(detail.QUANTITY);
  //         const ppr_date = parseFloat(detail.created_at);

  //         // Reduce stock sale_qty for the given prod_id and company_id
  //         await trx(STOCKLEDGER.NAME)
  //           .where(STOCKLEDGER.COLUMNS.DATE, ppr_date)
  //           .where(STOCKLEDGER.COLUMNS.PROD_ID, materialId)
  //           .andWhere(STOCKLEDGER.COLUMNS.COMPANY_ID, companyId)
  //           .andWhere(STOCKLEDGER.COLUMNS.WH_ID, companyId)
  //           .decrement(STOCKLEDGER.COLUMNS.SALE_QTY, quantityToReduce)
  //           .update({
  //             [STOCKLEDGER.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //             [STOCKLEDGER.COLUMNS.UPDATED_BY]: updatedBy
  //           });
  //       }
  //     }

  //     return { success: true };
  //   });
  // }

  async function postFmcgPlanningIssue({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      // Insert into PRODUCT_PLAN_HDR and get the PP_ID
      const [purchasePlanHdrInsertQuery] = await trx(PRODUCT_PLAN_HDR.NAME)
        .returning(PRODUCT_PLAN_HDR.COLUMNS.PP_ID)
        .insert({
          [PRODUCT_PLAN_HDR.COLUMNS.PP_DATE]: body.pp_date || new Date(),
          [PRODUCT_PLAN_HDR.COLUMNS.PP_TIME]: body.pp_time || new Date(),
          [PRODUCT_PLAN_HDR.COLUMNS.PP_KIT_ISS_MST]: body.pp_kitissmst || '',
          [PRODUCT_PLAN_HDR.COLUMNS.PP_UID]: userDetails.id,
          [PRODUCT_PLAN_HDR.COLUMNS.PP_CID]: userDetails.company_id,
          [PRODUCT_PLAN_HDR.COLUMNS.PP_YEAR]: financialYear,
          [PRODUCT_PLAN_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const purchasePpId = purchasePlanHdrInsertQuery.pp_id
      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }


      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.product_plan_details?.length > 0) {
        const planDetailsData = body.product_plan_details.map(detail => ({
          [PRODUCT_PLAN_DTL.COLUMNS.PPD_ID]: purchasePpId,
          [PRODUCT_PLAN_DTL.COLUMNS.SERIAL_NO]: detail.ppd_srlno,
          [PRODUCT_PLAN_DTL.COLUMNS.MATERIAL_ID]: detail.ppd_matid,
          [PRODUCT_PLAN_DTL.COLUMNS.QUANTITY]: detail.ppd_qty,
          [PRODUCT_PLAN_DTL.COLUMNS.TIN]: detail.ppd_tin,
          [PRODUCT_PLAN_DTL.COLUMNS.CID]: userDetails.company_id,
          [PRODUCT_PLAN_DTL.COLUMNS.YEAR]: financialYear,
          [PRODUCT_PLAN_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PRODUCT_PLAN_DTL.NAME, planDetailsData);
      }

      // Batch Insert for PRODUCT_PLAN_REQ
      if (body.product_plan_requests?.length > 0) {
        const planRequestsData = body.product_plan_requests.map(detail => ({
          [PRODUCT_PLAN_REQ.COLUMNS.PPR_ID]: purchasePpId,
          [PRODUCT_PLAN_REQ.COLUMNS.SERIAL_NO]: detail.ppr_srlno,
          [PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID]: detail.ppr_matid,
          [PRODUCT_PLAN_REQ.COLUMNS.QUANTITY]: detail.ppr_qty,
          [PRODUCT_PLAN_REQ.COLUMNS.AVAILABLE_QUANTITY]: detail.ppr_availqty,
          [PRODUCT_PLAN_REQ.COLUMNS.COST]: detail.ppr_cost,
          [PRODUCT_PLAN_REQ.COLUMNS.CID]: userDetails.company_id,
          [PRODUCT_PLAN_REQ.COLUMNS.YEAR]: financialYear,
          [PRODUCT_PLAN_REQ.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_REQ.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PRODUCT_PLAN_REQ.NAME, planRequestsData);
      }

      return { success: true };
    });
  }
  async function updateStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const createdBy = userDetails.id;

      if (body.product_plan_requests?.length > 0) {
        const stockLedgerData = body.product_plan_requests.map(detail => ({
          [STOCKLEDGER.COLUMNS.DATE]: body.pp_date || new Date(),
          [STOCKLEDGER.COLUMNS.PROD_ID]: detail.ppr_matid,
          [STOCKLEDGER.COLUMNS.SALE_QTY]: detail.ppr_qty,
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
                    INSERT INTO ${STOCKLEDGER.NAME} (${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.SALE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID}, ${STOCKLEDGER.COLUMNS.CREATED_AT}, ${STOCKLEDGER.COLUMNS.UPDATED_AT}, ${STOCKLEDGER.COLUMNS.CREATED_BY}, ${STOCKLEDGER.COLUMNS.UPDATED_BY}, ${STOCKLEDGER.COLUMNS.WH_ID})
                    VALUES ${batch.map(d => `('${d.date}', '${d.prod_id}', ${d.sale_qty}, '${d.company_id}', NOW(), NOW(), '${d.created_by}', '${d.updated_by}','${d.company_id}')`).join(", ")}
                    ON CONFLICT (${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.COMPANY_ID},${STOCKLEDGER.COLUMNS.WH_ID})
                    DO UPDATE SET
                        ${STOCKLEDGER.COLUMNS.SALE_QTY} = ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.SALE_QTY} + EXCLUDED.${STOCKLEDGER.COLUMNS.SALE_QTY},
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
      const ppId = params.planning_issue_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(PRODUCT_PLAN_REQ.NAME)
        .select(PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID, PRODUCT_PLAN_REQ.COLUMNS.QUANTITY)
        .where(PRODUCT_PLAN_REQ.COLUMNS.PPR_ID, ppId);

      // Debugging: Log data to check for invalid values
      console.log("Fetched Product Plan Requests:", productPlanRequests);

      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID], 10);
          const saleQty = parseFloat(detail[PRODUCT_PLAN_REQ.COLUMNS.QUANTITY]);

          // Ensure that only valid numbers are processed
          if (isNaN(prodId) || isNaN(saleQty)) {
            console.warn("Skipping invalid entry:", detail);
            return null; // Skip invalid rows
          }

          return {
            [STOCKLEDGER.COLUMNS.PROD_ID]: prodId,
            [STOCKLEDGER.COLUMNS.SALE_QTY]: saleQty,
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
          .map(d => `(${d[STOCKLEDGER.COLUMNS.PROD_ID]}, ${d[STOCKLEDGER.COLUMNS.SALE_QTY]}, ${d[STOCKLEDGER.COLUMNS.COMPANY_ID]})`)
          .join(", ");

        await trx.raw(`
                UPDATE ${STOCKLEDGER.NAME}
                SET 
                    ${STOCKLEDGER.COLUMNS.SALE_QTY} = 
                        CASE 
                            WHEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.SALE_QTY} - subquery.${STOCKLEDGER.COLUMNS.SALE_QTY} >= 0 
                            THEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.SALE_QTY} - subquery.${STOCKLEDGER.COLUMNS.SALE_QTY}
                            ELSE 0
                        END,
                    ${STOCKLEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                    ${STOCKLEDGER.COLUMNS.UPDATED_BY} = ?
                FROM (
                    VALUES ${valuesClause}
                ) AS subquery(${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.SALE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID})
                WHERE ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PROD_ID} = subquery.${STOCKLEDGER.COLUMNS.PROD_ID}
                AND ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.COMPANY_ID} = subquery.${STOCKLEDGER.COLUMNS.COMPANY_ID};
            `, [updatedBy]);
      }

      return { success: true };
    });
  }
  async function putFmcgPlanningIssue({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.planning_issue_id;

      // Update PRODUCT_PLAN_HDR instead of inserting a new record
      await trx(PRODUCT_PLAN_HDR.NAME)
        .where(PRODUCT_PLAN_HDR.COLUMNS.PP_ID, purchasePpId)
        .update({
          [PRODUCT_PLAN_HDR.COLUMNS.PP_DATE]: body.pp_date || new Date(),
          [PRODUCT_PLAN_HDR.COLUMNS.PP_TIME]: body.pp_time || new Date(),
          [PRODUCT_PLAN_HDR.COLUMNS.PP_KIT_ISS_MST]: body.pp_kitissmst || '',
          [PRODUCT_PLAN_HDR.COLUMNS.PP_UID]: userDetails.id,
          [PRODUCT_PLAN_HDR.COLUMNS.PP_CID]: userDetails.company_id,
          [PRODUCT_PLAN_HDR.COLUMNS.PP_YEAR]: financialYear,
          [PRODUCT_PLAN_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });


      // DELETE existing records for this PP_ID before inserting new ones

      await trx(PRODUCT_PLAN_DTL.NAME).where(PRODUCT_PLAN_DTL.COLUMNS.PPD_ID, purchasePpId).del();
      await trx(PRODUCT_PLAN_REQ.NAME).where(PRODUCT_PLAN_REQ.COLUMNS.PPR_ID, purchasePpId).del();


      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }


      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.product_plan_details?.length > 0) {
        const planDetailsData = body.product_plan_details.map(detail => ({
          [PRODUCT_PLAN_DTL.COLUMNS.PPD_ID]: purchasePpId,
          [PRODUCT_PLAN_DTL.COLUMNS.SERIAL_NO]: detail.ppd_srlno,
          [PRODUCT_PLAN_DTL.COLUMNS.MATERIAL_ID]: detail.ppd_matid,
          [PRODUCT_PLAN_DTL.COLUMNS.QUANTITY]: detail.ppd_qty,
          [PRODUCT_PLAN_DTL.COLUMNS.TIN]: detail.ppd_tin,
          [PRODUCT_PLAN_DTL.COLUMNS.CID]: userDetails.company_id,
          [PRODUCT_PLAN_DTL.COLUMNS.YEAR]: financialYear,
          [PRODUCT_PLAN_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PRODUCT_PLAN_DTL.NAME, planDetailsData);
      }

      // Batch Insert for PRODUCT_PLAN_REQ
      if (body.product_plan_requests?.length > 0) {
        const planRequestsData = body.product_plan_requests.map(detail => ({
          [PRODUCT_PLAN_REQ.COLUMNS.PPR_ID]: purchasePpId,
          [PRODUCT_PLAN_REQ.COLUMNS.SERIAL_NO]: detail.ppr_srlno,
          [PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID]: detail.ppr_matid,
          [PRODUCT_PLAN_REQ.COLUMNS.QUANTITY]: detail.ppr_qty,
          [PRODUCT_PLAN_REQ.COLUMNS.AVAILABLE_QUANTITY]: detail.ppr_availqty,
          [PRODUCT_PLAN_REQ.COLUMNS.COST]: detail.ppr_cost,
          [PRODUCT_PLAN_REQ.COLUMNS.CID]: userDetails.company_id,
          [PRODUCT_PLAN_REQ.COLUMNS.YEAR]: financialYear,
          [PRODUCT_PLAN_REQ.COLUMNS.CREATED_BY]: userDetails.id,
          [PRODUCT_PLAN_REQ.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await batchInsertData(PRODUCT_PLAN_REQ.NAME, planRequestsData);
      }

      return { success: true };
    });
  }
  async function getFmcgPlanningIssue({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PRODUCT_PLAN_HDR.NAME}.*`
      ])
      .from(`${PRODUCT_PLAN_HDR.NAME}`)
      .orderBy(`${PRODUCT_PLAN_HDR.NAME}.${PRODUCT_PLAN_HDR.COLUMNS.PP_ID}`, "DESC");


    if (!from_date == '') {
      query.whereRaw(
        `DATE(${PRODUCT_PLAN_HDR.NAME}.${PRODUCT_PLAN_HDR.COLUMNS.PP_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${PRODUCT_PLAN_HDR.NAME}.${PRODUCT_PLAN_HDR.COLUMNS.PP_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Planning Issue Master",
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
        const product_plan_details = await knex
          .select([
            `${PRODUCT_PLAN_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_DTL.NAME} as ${PRODUCT_PLAN_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_DTL.NAME}.${PRODUCT_PLAN_DTL.COLUMNS.MATERIAL_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_DTL.NAME}.${PRODUCT_PLAN_DTL.COLUMNS.PPD_ID}`, offers.pp_id);

        const product_plan_requests = await knex
          .select([
            `${PRODUCT_PLAN_REQ.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_REQ.NAME} as ${PRODUCT_PLAN_REQ.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_REQ.NAME}.${PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_REQ.NAME}.${PRODUCT_PLAN_REQ.COLUMNS.PPR_ID}`, offers.pp_id);

        return { ...offers, product_plan_details, product_plan_requests };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getFmcgPlanningIssueInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PRODUCT_PLAN_HDR.NAME}.*`
      ])
      .from(`${PRODUCT_PLAN_HDR.NAME}`)
      .where(`${PRODUCT_PLAN_HDR.NAME}.${PRODUCT_PLAN_HDR.COLUMNS.PP_ID}`, params.planning_issue_id);



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Planning Issue Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Planning Issue Info data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.map(async offers => {
        const product_plan_details = await knex
          .select([
            `${PRODUCT_PLAN_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_DTL.NAME} as ${PRODUCT_PLAN_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_DTL.NAME}.${PRODUCT_PLAN_DTL.COLUMNS.MATERIAL_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_DTL.NAME}.${PRODUCT_PLAN_DTL.COLUMNS.PPD_ID}`, offers.pp_id);

        const product_plan_requests = await knex
          .select([
            `${PRODUCT_PLAN_REQ.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${PRODUCT_PLAN_REQ.NAME} as ${PRODUCT_PLAN_REQ.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${PRODUCT_PLAN_REQ.NAME}.${PRODUCT_PLAN_REQ.COLUMNS.MATERIAL_ID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${PRODUCT_PLAN_REQ.NAME}.${PRODUCT_PLAN_REQ.COLUMNS.PPR_ID}`, offers.pp_id);

        return { ...offers, product_plan_details, product_plan_requests };
      })
    );


    return responsewith_details[0];
  }
  async function deleteFmcgPlanningIssueInfo({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.planning_issue_id;


      // DELETE existing records for this PP_ID before inserting new ones

      const query1 = trx(PRODUCT_PLAN_HDR.NAME).where(PRODUCT_PLAN_HDR.COLUMNS.PP_ID, purchasePpId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete product plan header",
        logTrace
      });
      const query2 = trx(PRODUCT_PLAN_DTL.NAME).where(PRODUCT_PLAN_DTL.COLUMNS.PPD_ID, purchasePpId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete product plan detail",
        logTrace
      });
      const query3 = trx(PRODUCT_PLAN_REQ.NAME).where(PRODUCT_PLAN_REQ.COLUMNS.PPR_ID, purchasePpId).del();
      await query3;
      logQuery({
        logger: fastify.log,
        query: query3,
        context: "Delete product plan request",
        logTrace
      });
      return { success: true };
    });
  }

  return {
    postFmcgPlanningIssue,
    putFmcgPlanningIssue,
    updateStockLedger,
    reduceStockLedger,
    planningIssueRepo,
    getFmcgPlanningIssue,
    getFmcgPlanningIssueInfo,
    deleteFmcgPlanningIssueInfo,
    getFmcgPlanningIssueDocno
  };
}

module.exports = planningIssueRepo
