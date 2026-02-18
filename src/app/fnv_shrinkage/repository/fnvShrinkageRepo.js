const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const _ = require("lodash");
const { ITEM } = require("../../catalog/item/commons/constants")
const { FVSHRINKAGE_HDR, FVSHRINKAGE_DTL, STOCKLEDGER, UNITS } = require("../commons/constants")
const { REASON } = require("../../catalog/reason/commons/constants");


function fmcgShrinkageRepo(fastify) {

  async function getShrinkageDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(FVSHRINKAGE_HDR.NAME)
      .returning("w_id")
      .orderBy(FVSHRINKAGE_HDR.COLUMNS.W_ID, 'desc')
      .limit(1);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get FMCG Shrinkage docno",
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

  async function postShrinkage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      // Insert into PRODUCT_PLAN_HDR and get the PP_ID
      const [purchasePlanHdrInsertQuery] = await trx(FVSHRINKAGE_HDR.NAME)
        .returning(FVSHRINKAGE_HDR.COLUMNS.W_ID)
        .insert({
          [FVSHRINKAGE_HDR.COLUMNS.W_DATE]: body.w_date || new Date(),
          [FVSHRINKAGE_HDR.COLUMNS.W_YEAR]: financialYear,
          [FVSHRINKAGE_HDR.COLUMNS.W_TOT]: body.w_tot,
          [FVSHRINKAGE_HDR.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [FVSHRINKAGE_HDR.COLUMNS.W_GTOT]: body.w_gtot,
          [FVSHRINKAGE_HDR.COLUMNS.W_UID]: userDetails.id,
          [FVSHRINKAGE_HDR.COLUMNS.W_MUID]: body.w_muid || null,
          [FVSHRINKAGE_HDR.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [FVSHRINKAGE_HDR.COLUMNS.W_COM_ID]: userDetails.company_id,
          [FVSHRINKAGE_HDR.COLUMNS.W_PGTOT]: body.w_pgtot,
          [FVSHRINKAGE_HDR.COLUMNS.W_OTHERS]: body.w_others,
          [FVSHRINKAGE_HDR.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [FVSHRINKAGE_HDR.COLUMNS.W_REMARK]: body.w_remark || '',
          [FVSHRINKAGE_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [FVSHRINKAGE_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const purchasePpId = purchasePlanHdrInsertQuery.w_id
      // Helper function for batch inserts
      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      if (body.shrinkage_details?.length > 0) {
        const wastageDetailsData = [];

        for (const detail of body.shrinkage_details) {


          // 2. Fetch purchase rate
          const purchaseRateRow = await trx(ITEM.NAME)
            .where({ [ITEM.COLUMNS.ID]: detail.wd_prdid })
            .select(ITEM.COLUMNS.PURCHASE_RATE)
            .first();

          const purchaseRate = purchaseRateRow?.[ITEM.COLUMNS.PURCHASE_RATE] || 0;
          const wdAmt = purchaseRate * detail.wd_qty;

          // 3. Prepare shrinkage detail data
          wastageDetailsData.push({
            [FVSHRINKAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
            [FVSHRINKAGE_DTL.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
            [FVSHRINKAGE_DTL.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
            [FVSHRINKAGE_DTL.COLUMNS.WD_SLNO]: detail.wd_slno,
            [FVSHRINKAGE_DTL.COLUMNS.WD_PRDID]: detail.wd_prdid,
            [FVSHRINKAGE_DTL.COLUMNS.WD_BATCHNO]: detail.wd_batchno || '',
            [FVSHRINKAGE_DTL.COLUMNS.WD_EXPDATE]: detail.wd_expdate || '',
            [FVSHRINKAGE_DTL.COLUMNS.WD_QTY]: detail.wd_qty,
            [FVSHRINKAGE_DTL.COLUMNS.WD_DIS]: detail.wd_dis,
            [FVSHRINKAGE_DTL.COLUMNS.WD_DIS_AMT]: detail.wd_disamt,
            [FVSHRINKAGE_DTL.COLUMNS.WD_VAT]: detail.wd_vat,
            [FVSHRINKAGE_DTL.COLUMNS.WD_VAT_AMT]: detail.wd_vatamt,
            [FVSHRINKAGE_DTL.COLUMNS.WD_RATE]: detail.wd_rate,
            [FVSHRINKAGE_DTL.COLUMNS.WD_AMT]: wdAmt,
            [FVSHRINKAGE_DTL.COLUMNS.WD_COM_ID]: userDetails.company_id,
            [FVSHRINKAGE_DTL.COLUMNS.WD_PRATE]: purchaseRate,
            [FVSHRINKAGE_DTL.COLUMNS.WD_PAMT]: wdAmt,
            [FVSHRINKAGE_DTL.COLUMNS.WD_SUPP_ID]: detail.wd_suppid,
            [FVSHRINKAGE_DTL.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
            [FVSHRINKAGE_DTL.COLUMNS.CREATED_BY]: userDetails.id,
            [FVSHRINKAGE_DTL.COLUMNS.UPDATED_BY]: userDetails.id
          });
        }
        await batchInsertData(FVSHRINKAGE_DTL.NAME, wastageDetailsData);
      }

      // Step 3: Update Item Stock
      if (_.isArray(body.shrinkage_details)) {
        await Promise.all(
          _.map(body.shrinkage_details, async (element) => {
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

      if (body.shrinkage_details?.length > 0) {
        const stockLedgerData = body.shrinkage_details.map(detail => ({
          [STOCKLEDGER.COLUMNS.DATE]: detail.wd_date || new Date(),
          [STOCKLEDGER.COLUMNS.PROD_ID]: detail.wd_prdid,
          [STOCKLEDGER.COLUMNS.WASTAGE_QTY]: detail.wd_qty,
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
      const ppId = params.shrinkage_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(FVSHRINKAGE_DTL.NAME)
        .select(FVSHRINKAGE_DTL.COLUMNS.WD_PRDID, FVSHRINKAGE_DTL.COLUMNS.WD_QTY)
        .where(FVSHRINKAGE_DTL.COLUMNS.WD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[FVSHRINKAGE_DTL.COLUMNS.WD_PRDID], 10);
          const wasteQty = parseFloat(detail[FVSHRINKAGE_DTL.COLUMNS.WD_QTY]);

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
  async function putShrinkage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;
    const { shrinkage_details } = body;
    return knex.transaction(async trx => {

      const purchasePpId = params.shrinkage_id;

      // Update PRODUCT_PLAN_HDR instead of inserting a new record
      await trx(FVSHRINKAGE_HDR.NAME)
        .where(FVSHRINKAGE_HDR.COLUMNS.W_ID, purchasePpId)
        .update({
          [FVSHRINKAGE_HDR.COLUMNS.W_DATE]: body.w_date || new Date(),
          [FVSHRINKAGE_HDR.COLUMNS.W_YEAR]: financialYear,
          [FVSHRINKAGE_HDR.COLUMNS.W_TOT]: body.w_tot,
          [FVSHRINKAGE_HDR.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [FVSHRINKAGE_HDR.COLUMNS.W_GTOT]: body.w_gtot,
          [FVSHRINKAGE_HDR.COLUMNS.W_UID]: userDetails.id,
          [FVSHRINKAGE_HDR.COLUMNS.W_MUID]: body.w_muid || null,
          [FVSHRINKAGE_HDR.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [FVSHRINKAGE_HDR.COLUMNS.W_COM_ID]: userDetails.company_id,
          [FVSHRINKAGE_HDR.COLUMNS.W_PGTOT]: body.w_pgtot,
          [FVSHRINKAGE_HDR.COLUMNS.W_OTHERS]: body.w_others,
          [FVSHRINKAGE_HDR.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [FVSHRINKAGE_HDR.COLUMNS.W_REMARK]: body.w_remark || '',
          [FVSHRINKAGE_HDR.COLUMNS.CREATED_BY]: userDetails.id,
          [FVSHRINKAGE_HDR.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      // // Helper function for batch inserts
      // async function batchInsertData(tableName, data, chunkSize = 50) {
      //   for (let i = 0; i < data.length; i += chunkSize) {
      //     await trx(tableName).insert(data.slice(i, i + chunkSize));
      //   }
      // }

      // Step 4: Update Item Existing Stock Details
      if (Array.isArray(shrinkage_details)) {
        console.log(shrinkage_details, "Shrinkage Details")
        await Promise.all(
          body.shrinkage_details.map(async (element) => {
            const rateResponse = await trx(FVSHRINKAGE_DTL.NAME)
              .select(
                `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_QTY} as qty`,
              )
              .where({
                [FVSHRINKAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
                [FVSHRINKAGE_DTL.COLUMNS.WD_PRDID]: element.wd_prdid
              })
              .first();
            console.log(rateResponse, rateResponse.qty, element.wd_qty, "rate response")
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
      if (body.shrinkage_details?.length > 0) {
        const wastageDetailsData = body.shrinkage_details.map(detail => ({
          [FVSHRINKAGE_DTL.COLUMNS.WD_ID]: purchasePpId,
          [FVSHRINKAGE_DTL.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
          [FVSHRINKAGE_DTL.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
          [FVSHRINKAGE_DTL.COLUMNS.WD_SLNO]: detail.wd_slno,
          [FVSHRINKAGE_DTL.COLUMNS.WD_PRDID]: detail.wd_prdid,
          [FVSHRINKAGE_DTL.COLUMNS.WD_BATCHNO]: detail.wd_batchno || '',
          [FVSHRINKAGE_DTL.COLUMNS.WD_EXPDATE]: detail.wd_expdate || '',
          [FVSHRINKAGE_DTL.COLUMNS.WD_QTY]: detail.wd_qty,
          [FVSHRINKAGE_DTL.COLUMNS.WD_DIS]: detail.wd_dis,
          [FVSHRINKAGE_DTL.COLUMNS.WD_DIS_AMT]: detail.wd_disamt,
          [FVSHRINKAGE_DTL.COLUMNS.WD_VAT]: detail.wd_vat,
          [FVSHRINKAGE_DTL.COLUMNS.WD_VAT_AMT]: detail.wd_vatamt,
          [FVSHRINKAGE_DTL.COLUMNS.WD_RATE]: detail.wd_rate,
          [FVSHRINKAGE_DTL.COLUMNS.WD_AMT]: detail.wd_amt,
          [FVSHRINKAGE_DTL.COLUMNS.WD_COM_ID]: userDetails.company_id,
          [FVSHRINKAGE_DTL.COLUMNS.WD_PRATE]: detail.wd_prate,
          [FVSHRINKAGE_DTL.COLUMNS.WD_PAMT]: detail.wd_pamt,
          [FVSHRINKAGE_DTL.COLUMNS.WD_SUPP_ID]: detail.wd_suppid,
          [FVSHRINKAGE_DTL.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
          [FVSHRINKAGE_DTL.COLUMNS.CREATED_BY]: userDetails.id,
          [FVSHRINKAGE_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        //insert shrinkage details
        await trx(FVSHRINKAGE_DTL.NAME)
          .insert(wastageDetailsData)
          .onConflict([FVSHRINKAGE_DTL.COLUMNS.WD_ID, FVSHRINKAGE_DTL.COLUMNS.WD_PRDID])
          .merge(); // merge will update if conflict happens, else insert 
      }

      return { success: true };
    });
  }
  async function getShrinkage({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${FVSHRINKAGE_HDR.NAME}.*`
      ])
      .from(`${FVSHRINKAGE_HDR.NAME}`)
      .orderBy(`${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_ID}`, "DESC");


    if (!from_date == '') {
      query.whereRaw(
        `DATE(${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Shrinkage Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Shrinkage Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const shrinkage_details = await knex
          .select([
            `${FVSHRINKAGE_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${FVSHRINKAGE_DTL.NAME} as ${FVSHRINKAGE_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .where(`${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_ID}`, offers.w_id);


        return { ...offers, shrinkage_details };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getShrinkageInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${FVSHRINKAGE_HDR.NAME}.*`
      ])
      .from(`${FVSHRINKAGE_HDR.NAME}`)
      .where(`${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_ID}`, params.shrinkage_id);


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Shrinkage Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Shrinkage data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.data.map(async offers => {
        const shrinkage_details = await knex
          .select([
            `${FVSHRINKAGE_DTL.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_name`,
            `${ITEM.NAME}.${ITEM.COLUMNS.BALANCE} as stock`,
            `${REASON.NAME}.${REASON.COLUMNS.REASON_NAME} as reason_name`,

          ])
          .from(`${FVSHRINKAGE_DTL.NAME} as ${FVSHRINKAGE_DTL.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(
            `${UNITS.NAME} as ${UNITS.NAME}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
            `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
          )
          .leftJoin(
            `${REASON.NAME} as ${REASON.NAME}`,
            `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_REASON_ID}`,
            `${REASON.NAME}.${REASON.COLUMNS.ID}`
          )
          .where(`${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_ID}`, offers.w_id);


        return { ...offers, shrinkage_details };
      })
    );


    return responsewith_details[0];
  }
  async function deleteShrinkage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const purchasePpId = params.shrinkage_id;
      // Step 1: Get Shrinkage_ID already exists
      const existingShrinkage = await trx(FVSHRINKAGE_HDR.NAME)
        .select(
          `${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_ID}`,
          `${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}`
        )
        .where({
          [FVSHRINKAGE_HDR.COLUMNS.W_ID]: purchasePpId
        })
        .first();

      if (!existingShrinkage) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Shrinkage was not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
      console.log(existingShrinkage, "master details")

      // Step 2: Get Shrinkage_Details already exists
      const existingShrinkageDetail = await trx(FVSHRINKAGE_DTL.NAME)
        .select([
          `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.ID}`,
          `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_PRDID}`,
          `${FVSHRINKAGE_DTL.NAME}.${FVSHRINKAGE_DTL.COLUMNS.WD_QTY}`
        ])
        .where({
          [FVSHRINKAGE_DTL.COLUMNS.WD_ID]: purchasePpId
        })

      console.log(existingShrinkageDetail, "details")

      if (Array.isArray(existingShrinkageDetail) && existingShrinkageDetail.length > 0) {
        await Promise.all(existingShrinkageDetail.map(async (element) => {
          const prodId = element.wd_prdid;
          const totalReceivedQty = parseFloat(element.wd_qty) || 0;
          await trx(ITEM.NAME)
            .where(ITEM.COLUMNS.ID, prodId)
            .update({
              [ITEM.COLUMNS.BALANCE]: trx.raw(
                `${ITEM.COLUMNS.BALANCE} + ?`,
                [totalReceivedQty]
              )
            });
        }));
      }
      // DELETE existing records for this P_ID  
      const query1 = trx(FVSHRINKAGE_HDR.NAME).where(FVSHRINKAGE_HDR.COLUMNS.W_ID, purchasePpId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete fmcg shrinkage header",
        logTrace
      });
      const query2 = trx(FVSHRINKAGE_DTL.NAME).where(FVSHRINKAGE_DTL.COLUMNS.WD_ID, purchasePpId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete fmcg shrinkage detail",
        logTrace
      });
      return { success: true };
    });
  }

  async function getShrinkageEditListRepo({ queryString, params, logTrace }) {
    const knex = this;
    const { from_date, to_date } = queryString;

    const query = knex
      .select([
        `${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_ID}`,
        `${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}`
      ])
      .from(`${FVSHRINKAGE_HDR.NAME}`)
      .orderBy(`${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_ID}`, "DESC");


    if (from_date) {
      query.whereRaw(
        `DATE(${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}) >= ?`, from_date
      )
    }
    if (to_date) {
      query.whereRaw(
        `DATE(${FVSHRINKAGE_HDR.NAME}.${FVSHRINKAGE_HDR.COLUMNS.W_DATE}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Shrinkage Master",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Shrinkage Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    return response;
  }


  return {
    postShrinkage,
    putShrinkage,
    updateStockLedger,
    reduceStockLedger,
    getShrinkage,
    getShrinkageInfo,
    deleteShrinkage,
    getShrinkageDocno,
    getShrinkageEditListRepo
  };
}

module.exports = fmcgShrinkageRepo
