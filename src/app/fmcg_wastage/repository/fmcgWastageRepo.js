const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const _ = require("lodash");
const { ITEM } = require("../../catalog/item/commons/constants")
const { WASTAGE_HDR, WASTAGE_DTL, STOCKLEDGER, DNE_STOCK_LEDGER } = require("../commons/constants")
const { REASON } = require("../../catalog/reason/commons/constants");


function fmcgWastageRepo(fastify) {

  async function getWastageDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(WASTAGE_HDR.NAME)
      .returning("w_id")
      .orderBy(WASTAGE_HDR.COLUMNS.W_ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get FMCG docno",
      logTrace
    });

    const response = await query;

    if (response.length === 0) {
      return { docno: 1 };
    }

    const docno = response[0].w_id;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }
  async function postWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      // Insert into PRODUCT_PLAN_HDR and get the PP_ID
      const [purchasePlanHdrInsertQuery] = await trx(WASTAGE_HDR.NAME)
        .returning(WASTAGE_HDR.COLUMNS.W_ID)
        .insert({
          [WASTAGE_HDR.COLUMNS.W_DATE]: body.w_date || new Date(),
          [WASTAGE_HDR.COLUMNS.W_YEAR]: financialYear,
          [WASTAGE_HDR.COLUMNS.W_TOT]: body.w_tot,
          [WASTAGE_HDR.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [WASTAGE_HDR.COLUMNS.W_GTOT]: body.w_gtot,
          [WASTAGE_HDR.COLUMNS.W_UID]: userDetails.id,
          [WASTAGE_HDR.COLUMNS.W_MUID]: body.w_muid || null,
          [WASTAGE_HDR.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [WASTAGE_HDR.COLUMNS.W_COM_ID]: userDetails.company_id,
          [WASTAGE_HDR.COLUMNS.W_PGTOT]: body.w_pgtot,
          [WASTAGE_HDR.COLUMNS.W_OTHERS]: body.w_others,
          [WASTAGE_HDR.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [WASTAGE_HDR.COLUMNS.W_REMARK]: body.w_remark || '',
          [WASTAGE_HDR.COLUMNS.W_PACKID]: body.w_packid,
          [WASTAGE_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [WASTAGE_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const purchasePpId = purchasePlanHdrInsertQuery.w_id
      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.wastage_details?.length > 0) {
        const wastageDetailsData = body.wastage_details.map(detail => ({
          [WASTAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
          [WASTAGE_DTL.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
          [WASTAGE_DTL.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
          [WASTAGE_DTL.COLUMNS.WD_SLNO]: detail.wd_slno,
          [WASTAGE_DTL.COLUMNS.WD_PRDID]: detail.wd_prdid,
          [WASTAGE_DTL.COLUMNS.WD_BATCHNO]: detail.wd_batchno,
          [WASTAGE_DTL.COLUMNS.WD_EXPDATE]: detail.wd_expdate,
          [WASTAGE_DTL.COLUMNS.WD_QTY]: detail.wd_qty,
          [WASTAGE_DTL.COLUMNS.WD_DIS]: detail.wd_dis,
          [WASTAGE_DTL.COLUMNS.WD_DIS_AMT]: detail.wd_disamt,
          [WASTAGE_DTL.COLUMNS.WD_VAT]: detail.wd_vat,
          [WASTAGE_DTL.COLUMNS.WD_VAT_AMT]: detail.wd_vatamt,
          [WASTAGE_DTL.COLUMNS.WD_RATE]: detail.wd_rate,
          [WASTAGE_DTL.COLUMNS.WD_AMT]: detail.wd_amt,
          [WASTAGE_DTL.COLUMNS.WD_COM_ID]: userDetails.company_id,
          [WASTAGE_DTL.COLUMNS.WD_PRATE]: detail.wd_prate,
          [WASTAGE_DTL.COLUMNS.WD_PAMT]: detail.wd_pamt,
          [WASTAGE_DTL.COLUMNS.WD_SUPP_ID]: detail.wd_supp_id,
          [WASTAGE_DTL.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
          [WASTAGE_DTL.COLUMNS.WD_WH_STOCK]: detail.wd_whstock,
          [WASTAGE_DTL.COLUMNS.WD_DNE]: detail.wd_dne,
          [WASTAGE_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [WASTAGE_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));
        await batchInsertData(WASTAGE_DTL.NAME, wastageDetailsData);
      }

      // Step 4: Update Item Stock
      if (_.isArray(body.wastage_details)) {
        await Promise.all(
          _.map(body.wastage_details, async (element) => {
            const updateData = {
              [ITEM.COLUMNS.BALANCE]: trx.raw(
                `${ITEM.COLUMNS.BALANCE} - ?`,
                [parseFloat(element.wd_qty) || 0]
              ),
            };
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.wd_prdid)
              .update(updateData)
          })
        );
      }

      return { success: true };
    });
  }
  async function updateStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const createdBy = userDetails.id;

      if (body.wastage_details?.length > 0) {
        const stockLedgerData = body.wastage_details.map(detail => ({
          [STOCKLEDGER.COLUMNS.DATE]: detail.wd_date || new Date(),
          [STOCKLEDGER.COLUMNS.PROD_ID]: detail.wd_prdid,
          [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: detail.wd_whstock,
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
                    INSERT INTO ${STOCKLEDGER.NAME} (${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.WASTAGE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID}, ${STOCKLEDGER.COLUMNS.CREATED_AT}, ${STOCKLEDGER.COLUMNS.UPDATED_AT}, ${STOCKLEDGER.COLUMNS.CREATED_BY}, ${STOCKLEDGER.COLUMNS.UPDATED_BY}, ${STOCKLEDGER.COLUMNS.WH_ID})
                    VALUES ${batch.map(d => `('${d.date}', '${d.prod_id}', ${d.wastage_qty}, '${d.company_id}', NOW(), NOW(), '${d.created_by}', '${d.updated_by}','${d.company_id}')`).join(", ")}
                    ON CONFLICT (${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.DATE}, ${STOCKLEDGER.COLUMNS.COMPANY_ID},${STOCKLEDGER.COLUMNS.WH_ID})
                    DO UPDATE SET
                        ${STOCKLEDGER.COLUMNS.WASTAGE_QTY} = ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.WASTAGE_QTY} + EXCLUDED.${STOCKLEDGER.COLUMNS.WASTAGE_QTY},
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
      const ppId = params.wastage_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(WASTAGE_DTL.NAME)
        .select(WASTAGE_DTL.COLUMNS.WD_PRDID, WASTAGE_DTL.COLUMNS.WD_WH_STOCK)
        .where(WASTAGE_DTL.COLUMNS.WD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[WASTAGE_DTL.COLUMNS.WD_PRDID], 10);
          const wasteQty = parseFloat(detail[WASTAGE_DTL.COLUMNS.WD_WH_STOCK]);

          // Ensure that only valid numbers are processed
          if (isNaN(prodId) || isNaN(wasteQty)) {
            console.warn("Skipping invalid entry:", detail);
            return null; // Skip invalid rows
          }

          return {
            [STOCKLEDGER.COLUMNS.PROD_ID]: prodId,
            [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: wasteQty,
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
          .map(d => `(${d[STOCKLEDGER.COLUMNS.PROD_ID]}, ${d[STOCKLEDGER.COLUMNS.WASTAGE_QTY]}, ${d[STOCKLEDGER.COLUMNS.COMPANY_ID]})`)
          .join(", ");

        await trx.raw(`
                UPDATE ${STOCKLEDGER.NAME}
                SET 
                    ${STOCKLEDGER.COLUMNS.WASTAGE_QTY} = 
                        CASE 
                            WHEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.WASTAGE_QTY} - subquery.${STOCKLEDGER.COLUMNS.WASTAGE_QTY} >= 0 
                            THEN ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.WASTAGE_QTY} - subquery.${STOCKLEDGER.COLUMNS.WASTAGE_QTY}
                            ELSE 0
                        END,
                    ${STOCKLEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                    ${STOCKLEDGER.COLUMNS.UPDATED_BY} = ?
                FROM (
                    VALUES ${valuesClause}
                ) AS subquery(${STOCKLEDGER.COLUMNS.PROD_ID}, ${STOCKLEDGER.COLUMNS.WASTAGE_QTY}, ${STOCKLEDGER.COLUMNS.COMPANY_ID})
                WHERE ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.PROD_ID} = subquery.${STOCKLEDGER.COLUMNS.PROD_ID}
                AND ${STOCKLEDGER.NAME}.${STOCKLEDGER.COLUMNS.COMPANY_ID} = subquery.${STOCKLEDGER.COLUMNS.COMPANY_ID};
            `, [updatedBy]);
      }

      return { success: true };
    });
  }
  async function putWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.wastage_id;

      // Update PRODUCT_PLAN_HDR instead of inserting a new record
      await trx(WASTAGE_HDR.NAME)
        .where(WASTAGE_HDR.COLUMNS.W_ID, purchasePpId)
        .update({
          [WASTAGE_HDR.COLUMNS.W_DATE]: body.w_date || new Date(),
          [WASTAGE_HDR.COLUMNS.W_YEAR]: financialYear,
          [WASTAGE_HDR.COLUMNS.W_TOT]: body.w_tot,
          [WASTAGE_HDR.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [WASTAGE_HDR.COLUMNS.W_GTOT]: body.w_gtot,
          [WASTAGE_HDR.COLUMNS.W_UID]: userDetails.id,
          [WASTAGE_HDR.COLUMNS.W_MUID]: body.w_muid || null,
          [WASTAGE_HDR.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [WASTAGE_HDR.COLUMNS.W_COM_ID]: userDetails.company_id,
          [WASTAGE_HDR.COLUMNS.W_PGTOT]: body.w_pgtot,
          [WASTAGE_HDR.COLUMNS.W_OTHERS]: body.w_others,
          [WASTAGE_HDR.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [WASTAGE_HDR.COLUMNS.W_REMARK]: body.w_remark || '',
          [WASTAGE_HDR.COLUMNS.W_PACKID]: body.w_packid,
          [WASTAGE_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [WASTAGE_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });


      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      // Step 4: Update Item Existing Stock Details
      if (Array.isArray(body.wastage_details)) {
        await Promise.all(
          body.wastage_details.map(async (element) => {
            const rateResponse = await trx(WASTAGE_DTL.NAME)
              .select(
                `${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_QTY} as qty`,
              )
              .where({
                [WASTAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
                [WASTAGE_DTL.COLUMNS.WD_PRDID]: element.wd_prdid
              })
              .first();
            console.log(rateResponse, "rate response")
            await trx(ITEM.NAME)
              .where(ITEM.COLUMNS.ID, element.wd_prdid)
              .update({
                [ITEM.COLUMNS.BALANCE]: trx.raw(
                  `${ITEM.COLUMNS.BALANCE} + ? - ? `,
                  [parseFloat(rateResponse.qty) || 0, parseFloat(element.wd_qty) || 0]
                )
              });
          })
        );
      }

      // Batch Insert for PRODUCT_PLAN_DTL
      if (body.wastage_details?.length > 0) {
        const wastageDetailsData = body.wastage_details.map(detail => ({
          [WASTAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
          [WASTAGE_DTL.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
          [WASTAGE_DTL.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
          [WASTAGE_DTL.COLUMNS.WD_SLNO]: detail.wd_slno,
          [WASTAGE_DTL.COLUMNS.WD_PRDID]: detail.wd_prdid,
          [WASTAGE_DTL.COLUMNS.WD_BATCHNO]: detail.wd_batchno,
          [WASTAGE_DTL.COLUMNS.WD_EXPDATE]: detail.wd_expdate,
          [WASTAGE_DTL.COLUMNS.WD_QTY]: detail.wd_qty,
          [WASTAGE_DTL.COLUMNS.WD_DIS]: detail.wd_dis,
          [WASTAGE_DTL.COLUMNS.WD_DIS_AMT]: detail.wd_dis_amt,
          [WASTAGE_DTL.COLUMNS.WD_VAT]: detail.wd_vat,
          [WASTAGE_DTL.COLUMNS.WD_VAT_AMT]: detail.wd_vat_amt,
          [WASTAGE_DTL.COLUMNS.WD_RATE]: detail.wd_rate,
          [WASTAGE_DTL.COLUMNS.WD_AMT]: detail.wd_amt,
          [WASTAGE_DTL.COLUMNS.WD_COM_ID]: userDetails.company_id,
          [WASTAGE_DTL.COLUMNS.WD_PRATE]: detail.wd_prate,
          [WASTAGE_DTL.COLUMNS.WD_PAMT]: detail.wd_pamt,
          [WASTAGE_DTL.COLUMNS.WD_SUPP_ID]: detail.wd_supp_id,
          [WASTAGE_DTL.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
          [WASTAGE_DTL.COLUMNS.WD_WH_STOCK]: detail.wd_wh_stock,
          [WASTAGE_DTL.COLUMNS.WD_DNE]: detail.wd_dne,
          [WASTAGE_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [WASTAGE_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));
        await trx(WASTAGE_DTL.NAME)
          .insert(wastageDetailsData)
          .onConflict([WASTAGE_DTL.COLUMNS.WD_ID, WASTAGE_DTL.COLUMNS.WD_PRDID])
          .merge(); // merge will update if conflict happens, else insert 
      }



      return { success: true };
    });
  }
  async function getWastage({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date, wastage_no } = queryString;

    const query = knex
      .select([
        `${WASTAGE_HDR.NAME}.*`
      ])
      .from(`${WASTAGE_HDR.NAME}`)
      .orderBy(`${WASTAGE_HDR.NAME}.${WASTAGE_HDR.COLUMNS.W_ID}`, "DESC");

    if (wastage_no) {
      query.whereRaw(
        `${WASTAGE_HDR.NAME}.${WASTAGE_HDR.COLUMNS.W_ID} =${wastage_no}`
      )
    }
    if (!from_date == '') {
      query.whereRaw(
        `DATE(${WASTAGE_HDR.NAME}.${WASTAGE_HDR.COLUMNS.W_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${WASTAGE_HDR.NAME}.${WASTAGE_HDR.COLUMNS.W_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Wastage Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Wastage Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const wastage_details = await knex
          .select([
            `${WASTAGE_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${WASTAGE_DTL.NAME} as ${WASTAGE_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_ID}`, offers.w_id);


        return { ...offers, wastage_details };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getWastageInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${WASTAGE_HDR.NAME}.*`
      ])
      .from(`${WASTAGE_HDR.NAME}`)
      .where(`${WASTAGE_HDR.NAME}.${WASTAGE_HDR.COLUMNS.W_ID}`, params.wastage_id);


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
        const wastage_details = await knex
          .select([
            `${WASTAGE_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${REASON.NAME}.${REASON.COLUMNS.REASON_NAME} as reason_name`,
          ])
          .from(`${WASTAGE_DTL.NAME} as ${WASTAGE_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${REASON.NAME} as ${REASON.NAME}`,
            `${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_REASON_ID}`,
            `${REASON.NAME}.${REASON.COLUMNS.ID}`
          )
          .where(`${WASTAGE_DTL.NAME}.${WASTAGE_DTL.COLUMNS.WD_ID}`, offers.w_id);


        return { ...offers, wastage_details };
      })
    );


    return responsewith_details[0];
  }
  async function deleteWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.wastage_id;
      // DELETE existing records for this P_ID  
      const query1 = trx(WASTAGE_HDR.NAME).where(WASTAGE_HDR.COLUMNS.W_ID, purchasePpId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete fmcg wastage header",
        logTrace
      });
      const query2 = trx(WASTAGE_DTL.NAME).where(WASTAGE_DTL.COLUMNS.WD_ID, purchasePpId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete fmcg wastage detail",
        logTrace
      });
      return { success: true };
    });
  }
  async function updateDneStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const createdBy = userDetails.id;

      if (body.wastage_details?.length > 0) {
        const stockLedgerData = body.wastage_details.map(detail => ({
          [DNE_STOCK_LEDGER.COLUMNS.DL_DATE]: detail.wd_date || new Date(),
          [DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS]: detail.wd_prdid,
          [DNE_STOCK_LEDGER.COLUMNS.DL_INWARD]: detail.wd_dne,
          [DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID]: companyId,
          [DNE_STOCK_LEDGER.COLUMNS.CREATED_AT]: new Date(),
          [DNE_STOCK_LEDGER.COLUMNS.UPDATED_AT]: new Date(),
          [DNE_STOCK_LEDGER.COLUMNS.CREATED_BY]: createdBy,
          [DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY]: createdBy,
          [DNE_STOCK_LEDGER.COLUMNS.DL_UID]: createdBy
        }));
        const chunkSize = 1000; // Adjust based on DB performance

        for (let i = 0; i < stockLedgerData.length; i += chunkSize) {
          const batch = stockLedgerData.slice(i, i + chunkSize);

          await trx.raw(`
                    INSERT INTO ${DNE_STOCK_LEDGER.NAME} (${DNE_STOCK_LEDGER.COLUMNS.DL_DATE}, ${DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS}, ${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD}, ${DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID}, ${DNE_STOCK_LEDGER.COLUMNS.CREATED_AT}, ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_AT}, ${DNE_STOCK_LEDGER.COLUMNS.CREATED_BY}, ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY}, ${DNE_STOCK_LEDGER.COLUMNS.DL_UID})
                    VALUES ${batch.map(d => `('${d.dl_date}', '${d.dl_items}', ${d.dl_inward}, '${d.dl_comid}', NOW(), NOW(), '${d.created_by}', '${d.updated_by}',${d.dl_uid})`).join(", ")}
                    ON CONFLICT (${DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS}, ${DNE_STOCK_LEDGER.COLUMNS.DL_DATE}, ${DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID})
                    DO UPDATE SET
                        ${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} = ${DNE_STOCK_LEDGER.NAME}.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} + EXCLUDED.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD}, 
                        ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                        ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY} = EXCLUDED.${DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY}
                `);
        }
      }

      return { success: true };
    });
  }
  async function reduceDneStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const updatedBy = userDetails.id;
      const ppId = params.wastage_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(WASTAGE_DTL.NAME)
        .select(WASTAGE_DTL.COLUMNS.WD_PRDID, WASTAGE_DTL.COLUMNS.WD_DNE)
        .where(WASTAGE_DTL.COLUMNS.WD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[WASTAGE_DTL.COLUMNS.WD_PRDID], 10);
          const wasteQty = parseFloat(detail[WASTAGE_DTL.COLUMNS.WD_DNE]);

          // Ensure that only valid numbers are processed
          if (isNaN(prodId) || isNaN(wasteQty)) {
            console.warn("Skipping invalid entry:", detail);
            return null; // Skip invalid rows
          }

          return {
            [DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS]: prodId,
            [DNE_STOCK_LEDGER.COLUMNS.DL_INWARD]: wasteQty,
            [DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID]: parseInt(companyId, 10),
            [DNE_STOCK_LEDGER.COLUMNS.UPDATED_AT]: trx.fn.now(),
            [DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY]: updatedBy
          };
        }).filter(Boolean); // Remove null values

        if (stockLedgerData.length === 0) {
          console.error("No valid stock ledger data to process.");
          return { success: false, message: "No valid stock data found." };
        }

        // Construct VALUES clause only with valid numbers
        const valuesClause = stockLedgerData
          .map(d => `(${d[DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS]}, ${d[DNE_STOCK_LEDGER.COLUMNS.DL_INWARD]}, ${d[DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID]})`)
          .join(", ");

        await trx.raw(`
                UPDATE ${DNE_STOCK_LEDGER.NAME}
                SET 
                    ${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} = 
                        CASE 
                            WHEN ${DNE_STOCK_LEDGER.NAME}.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} - subquery.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} >= 0 
                            THEN ${DNE_STOCK_LEDGER.NAME}.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD} - subquery.${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD}
                            ELSE 0
                        END,
                    ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_AT} = NOW(), 
                    ${DNE_STOCK_LEDGER.COLUMNS.UPDATED_BY} = ?
                FROM (
                    VALUES ${valuesClause}
                ) AS subquery(${DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS}, ${DNE_STOCK_LEDGER.COLUMNS.DL_INWARD}, ${DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID})
                WHERE ${DNE_STOCK_LEDGER.NAME}.${DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS} = subquery.${DNE_STOCK_LEDGER.COLUMNS.DL_ITEMS}
                AND ${DNE_STOCK_LEDGER.NAME}.${DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID} = subquery.${DNE_STOCK_LEDGER.COLUMNS.DL_COM_ID};
            `, [updatedBy]);
      }

      return { success: true };
    });
  }


  return {
    postWastage,
    putWastage,
    updateStockLedger,
    reduceStockLedger,
    getWastage,
    getWastageInfo,
    deleteWastage,
    getWastageDocno,
    updateDneStockLedger,
    reduceDneStockLedger,
  };
}

module.exports = fmcgWastageRepo
