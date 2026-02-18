const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const _ = require("lodash");
const { ITEM } = require("../../catalog/item/commons/constants")
const { OUTLET_WASTAGE_MASTER, OUTLET_WASTAGE_DETAILS } = require("../commons/constants")
const { REASON } = require("../../catalog/reason/commons/constants");
const { OUTLET_PRODUCT_MAPPING } = require("../../catalog/commons")


function fmcgWastageRepo(fastify) {

  async function getOutletWastageDocno({ logTrace, financialYear }) {
    const knex = this;

    const query = knex(OUTLET_WASTAGE_MASTER.NAME)
      .returning("w_id")
      .orderBy(OUTLET_WASTAGE_MASTER.COLUMNS.W_ID, 'desc')
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
  async function postOutletWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const [outletWastageInsertQuery] = await trx(OUTLET_WASTAGE_MASTER.NAME)
        .returning(OUTLET_WASTAGE_MASTER.COLUMNS.W_ID)
        .insert({
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_DATE]: body.w_date || new Date(),
          [OUTLET_WASTAGE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_YEAR]: financialYear,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_TOT]: body.w_tot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_GTOT]: body.w_gtot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_UID]: userDetails.id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_MUID]: body.w_muid || null,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_COM_ID]: userDetails.company_id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_PGTOT]: body.w_pgtot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_OTHERS]: body.w_others,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_REMARK]: body.w_remark || '',
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_PACKID]: body.w_packid,
          [OUTLET_WASTAGE_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const outletWastageId = outletWastageInsertQuery.w_id

      async function batchInsertData(tableName, data, chunkSize = 50) {
        for (let i = 0; i < data.length; i += chunkSize) {
          await trx(tableName).insert(data.slice(i, i + chunkSize));
        }
      }

      if (body.wastage_details?.length > 0) {
        const wastageDetailsData = body.wastage_details.map(detail => ({
          [OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID]: outletWastageId,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_SLNO]: detail.wd_slno,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID]: detail.wd_prdid,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_BATCHNO]: detail.wd_batchno,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_EXPDATE]: detail.wd_expdate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_QTY]: detail.wd_qty,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DIS]: detail.wd_dis,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DIS_AMT]: detail.wd_disamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_VAT]: detail.wd_vat,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_VAT_AMT]: detail.wd_vatamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_RATE]: detail.wd_rate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_AMT]: detail.wd_amt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_COM_ID]: userDetails.company_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRATE]: detail.wd_prate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PAMT]: detail.wd_pamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_SUPP_ID]: detail.wd_supp_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_WH_STOCK]: detail.wd_whstock,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DNE]: detail.wd_dne,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id
        }));
        await batchInsertData(OUTLET_WASTAGE_DETAILS.NAME, wastageDetailsData);
      }


      if (_.isArray(body.wastage_details)) {
        await Promise.all(
          _.map(body.wastage_details, async (element) => {
            const updateData = {
              [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
                `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} - ?`,
                [parseFloat(element.wd_qty) || 0]
              ),
            };
            await trx(OUTLET_PRODUCT_MAPPING.NAME)
              .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, element.wd_prdid)
              .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
              .update(updateData)
          })
        );
      }

      return { success: true };
    });
  }

  async function putOutletWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const outletWastageMasterId = params.wastage_id;

      const oldDetails = await trx(OUTLET_WASTAGE_DETAILS.NAME)
        .select(
          OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID,
          OUTLET_WASTAGE_DETAILS.COLUMNS.WD_QTY
        )
        .where(
          OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID,
          outletWastageMasterId
        );

      for (const row of oldDetails) {
        await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, row.wd_prdid)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
              `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} + ?`,
              [Number(row.wd_qty) || 0]
            )
          });
      }

      await trx(OUTLET_WASTAGE_MASTER.NAME)
        .where(OUTLET_WASTAGE_MASTER.COLUMNS.W_ID, outletWastageMasterId)
        .update({
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_DATE]: body.w_date || new Date(),
          [OUTLET_WASTAGE_MASTER.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_YEAR]: financialYear,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_TOT]: body.w_tot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_VAT_CST_AMT]: body.w_vatcstamt,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_GTOT]: body.w_gtot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_UID]: userDetails.id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_MUID]: body.w_muid || null,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_ROUND_OFF]: body.w_roundoff,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_COM_ID]: userDetails.company_id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_PGTOT]: body.w_pgtot,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_OTHERS]: body.w_others,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_DEL_STAT]: body.w_delstat,
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_REMARK]: body.w_remark || '',
          [OUTLET_WASTAGE_MASTER.COLUMNS.W_PACKID]: body.w_packid,
          [OUTLET_WASTAGE_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
          [OUTLET_WASTAGE_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      await trx(OUTLET_WASTAGE_DETAILS.NAME)
        .where(
          OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID,
          outletWastageMasterId
        )
        .del();

      if (Array.isArray(body.wastage_details) && body.wastage_details.length > 0) {
        const insertData = body.wastage_details.map(detail => ({
          [OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID]: outletWastageMasterId,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_ID]: body.outlet_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_YEAR]: financialYear || detail.wd_year,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DATE]: detail.wd_date || new Date(),
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_SLNO]: detail.wd_slno,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID]: detail.wd_prdid,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_BATCHNO]: detail.wd_batchno,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_EXPDATE]: detail.wd_expdate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_QTY]: detail.wd_qty,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DIS]: detail.wd_dis,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DIS_AMT]: detail.wd_disamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_VAT]: detail.wd_vat,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_VAT_AMT]: detail.wd_vatamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_RATE]: detail.wd_rate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_AMT]: detail.wd_amt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_COM_ID]: userDetails.company_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRATE]: detail.wd_prate,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PAMT]: detail.wd_pamt,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_SUPP_ID]: detail.wd_supp_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_REASON_ID]: detail.wd_reason_id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_WH_STOCK]: detail.wd_whstock,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DNE]: detail.wd_dne,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.CREATED_BY]: userDetails.id,
          [OUTLET_WASTAGE_DETAILS.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await trx(OUTLET_WASTAGE_DETAILS.NAME).insert(insertData);
      }

      
      for (const detail of body.wastage_details) {
        await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, detail.wd_prdid)
          .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, body.outlet_id)
          .update({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: trx.raw(
              `${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} - ?`,
              [Number(detail.wd_qty) || 0]
            )
          });
      }

      return { success: true, message: "Wastage updated successfully" };
    });
  }



  async function getOutletWastage({ queryString, params, logTrace }) {
    const knex = this;
    const { from_date, to_date, wastage_id } = queryString;

    const query = knex
      .select([
        `${OUTLET_WASTAGE_MASTER.NAME}.*`
      ])
      .from(`${OUTLET_WASTAGE_MASTER.NAME}`)
      .orderBy(`${OUTLET_WASTAGE_MASTER.NAME}.${OUTLET_WASTAGE_MASTER.COLUMNS.W_ID}`, "DESC");

    if (wastage_id) {
      query.whereRaw(
        `${OUTLET_WASTAGE_MASTER.NAME}.${OUTLET_WASTAGE_MASTER.COLUMNS.W_ID} =${wastage_id}`
      )
    }
    if (!from_date == '') {
      query.whereRaw(
        `DATE(${OUTLET_WASTAGE_MASTER.NAME}.${OUTLET_WASTAGE_MASTER.COLUMNS.W_DATE}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${OUTLET_WASTAGE_MASTER.NAME}.${OUTLET_WASTAGE_MASTER.COLUMNS.W_DATE}) <= ?`, to_date
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
      response.data.map(async outletWastageMasterData => {
        const wastage_details = await knex
          .select([
            `${OUTLET_WASTAGE_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
          ])
          .from(`${OUTLET_WASTAGE_DETAILS.NAME} as ${OUTLET_WASTAGE_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(OUTLET_PRODUCT_MAPPING.NAME, function () {
            this.on(
              `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID}`,
              '=',
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
            ).andOn(
              `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_ID}`,
              '=',
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            );
          })
          .where(`${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID}`, outletWastageMasterData.w_id);


        return { ...outletWastageMasterData, wastage_details };
      })
    );


    return {
      data: responsewith_details,
      meta: response.meta
    };
  }
  async function getOutletWastageInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLET_WASTAGE_MASTER.NAME}.*`
      ])
      .from(`${OUTLET_WASTAGE_MASTER.NAME}`)
      .where(`${OUTLET_WASTAGE_MASTER.NAME}.${OUTLET_WASTAGE_MASTER.COLUMNS.W_ID}`, params.wastage_id)
    // .first();


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Planning Inward Master",
      logTrace
    });
    const response = await query
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Planning Issue Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_details = await Promise.all(
      response.map(async outletWastageMasterData => {
        const wastage_details = await knex
          .select([
            `${OUTLET_WASTAGE_DETAILS.NAME}.*`,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
            `${REASON.NAME}.${REASON.COLUMNS.REASON_NAME} as reason_name`,
          ])
          .from(`${OUTLET_WASTAGE_DETAILS.NAME} as ${OUTLET_WASTAGE_DETAILS.NAME}`)
          .leftJoin(
            `${ITEM.NAME} as ${ITEM.NAME}`,
            `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID}`,
            `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
          )
          .leftJoin(OUTLET_PRODUCT_MAPPING.NAME, function () {
            this.on(
              `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID}`,
              '=',
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
            ).andOn(
              `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_ID}`,
              '=',
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
            );
          })
          .leftJoin(
            `${REASON.NAME} as ${REASON.NAME}`,
            `${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.WD_REASON_ID}`,
            `${REASON.NAME}.${REASON.COLUMNS.ID}`
          )
          .where(`${OUTLET_WASTAGE_DETAILS.NAME}.${OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID}`, outletWastageMasterData.w_id);


        return { ...outletWastageMasterData, wastage_details };
      })
    );


    return responsewith_details[0];
  }
  async function deleteOutletWastage({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {

      const outletWastageId = params.wastage_id;

      const query1 = trx(OUTLET_WASTAGE_MASTER.NAME).where(OUTLET_WASTAGE_MASTER.COLUMNS.W_ID, outletWastageId).del();
      await query1;
      logQuery({
        logger: fastify.log,
        query: query1,
        context: "Delete outlet wastage master",
        logTrace
      });
      const query2 = trx(OUTLET_WASTAGE_DETAILS.NAME).where(OUTLET_WASTAGE_DETAILS.COLUMNS.OUTLET_WASTAGE_MASTER_ID, outletWastageId).del();
      await query2;
      logQuery({
        logger: fastify.log,
        query: query2,
        context: "Delete outlet wastage detail",
        logTrace
      });
      return { success: true };
    });
  }
  async function updateDneOutletStockLedger({ params, body, logTrace, userDetails, financialYear }) {
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
  async function reduceDneOutletStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const updatedBy = userDetails.id;
      const ppId = params.wastage_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(OUTLET_WASTAGE_DETAILS.NAME)
        .select(OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID, OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DNE)
        .where(OUTLET_WASTAGE_DETAILS.COLUMNS.WD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID], 10);
          const wasteQty = parseFloat(detail[OUTLET_WASTAGE_DETAILS.COLUMNS.WD_DNE]);

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
  async function updateOutletStockLedger({ params, body, logTrace, userDetails, financialYear }) {
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
  async function reduceOutletStockLedger({ params, body, logTrace, userDetails, financialYear }) {
    const knex = this;

    return knex.transaction(async trx => {
      const companyId = userDetails.company_id;
      const updatedBy = userDetails.id;
      const ppId = params.wastage_id; // Get pp_id from params

      // Fetch product details from PRODUCT_PLAN_REQ for the given pp_id
      const productPlanRequests = await trx(OUTLET_WASTAGE_DETAILS.NAME)
        .select(OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID, OUTLET_WASTAGE_DETAILS.COLUMNS.WD_WH_STOCK)
        .where(OUTLET_WASTAGE_DETAILS.COLUMNS.WD_ID, ppId);



      if (productPlanRequests.length > 0) {
        const stockLedgerData = productPlanRequests.map(detail => {
          const prodId = parseInt(detail[OUTLET_WASTAGE_DETAILS.COLUMNS.WD_PRDID], 10);
          const wasteQty = parseFloat(detail[OUTLET_WASTAGE_DETAILS.COLUMNS.WD_WH_STOCK]);

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
  return {
    postOutletWastage,
    putOutletWastage,
    updateOutletStockLedger,
    reduceOutletStockLedger,
    getOutletWastage,
    getOutletWastageInfo,
    deleteOutletWastage,
    getOutletWastageDocno,
    updateDneOutletStockLedger,
    reduceDneOutletStockLedger,
  };
}

module.exports = fmcgWastageRepo
