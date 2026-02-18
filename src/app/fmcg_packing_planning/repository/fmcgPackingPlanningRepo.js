const { StatusCodes } = require("http-status-codes");
const { logQuery } = require("../../commons/helpers");
const { PLANNING_HDR, PLANNING_DTL, PURCHASE_DTL, PACKING_PLANNING_MASTER, PACKING_PLANNING_DETAILS } = require("../commons/constants");
const { ITEM } = require("../../catalog/item/commons/constants");
const { CustomError } = require("../../errorHandler");
const { UNITS } = require("../../catalog/units/commons/constants");
const { PURCHASE_FMCG_MASTER, PURCHASE_FMCG_DETAILS, STOCKLEDGER } = require("../../purchase/commons")
const { SUPPLIER } = require("../../catalog/supplier/commons/constants");


function fmcgPackingPlanningRepo(fastify) {

  async function getGrnForParentProduct({ queryString, params, logTrace }) {
    const knex = this;
    const { product_id } = params;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID} as purchase_id`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_NO} as purchase_no`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE} as purchase_date`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.ID} as purchase_detail_id`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID} as product_id`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY} as total_qty`,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PACK_QUANTITY} as packed_qty`,
        knex.raw(`(${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY} - COALESCE(${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PACK_QUANTITY}, 0)) as remaining_qty`),
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`
      ])
      .from(PURCHASE_FMCG_DETAILS.NAME)
      .join(
        PURCHASE_FMCG_MASTER.NAME,
        `${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PURCHASE_MASTER_ID}`,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.ID}`
      )
      .leftJoin(
        SUPPLIER.NAME,
        `${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID}`, product_id)
      .andWhere(
        knex.raw(
          `(${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.QUANTITY} - COALESCE(${PURCHASE_FMCG_DETAILS.NAME}.${PURCHASE_FMCG_DETAILS.COLUMNS.PACK_QUANTITY}, 0)) > 0`
        )
      )
      .andWhere(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}`, 'desc');

    if (from_date) {
      query.andWhereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) >= ?`,
        [from_date]
      );
    }

    if (to_date) {
      query.andWhereRaw(
        `DATE(${PURCHASE_FMCG_MASTER.NAME}.${PURCHASE_FMCG_MASTER.COLUMNS.DOC_DATE}) <= ?`,
        [to_date]
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get available purchases for parent product",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No purchases found with remaining quantity for this product",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }



  async function getPackingPlanningDocno({ logTrace }) {
    const knex = this;

    const query = knex(PACKING_PLANNING_MASTER.NAME)
      .select(PACKING_PLANNING_MASTER.COLUMNS.DOC_NO)
      .orderBy(PACKING_PLANNING_MASTER.COLUMNS.ID, "desc")
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Get fmcg Packing Planning docno",
      logTrace
    });

    const response = await query;

    if (!response) {
      return { docno: 1 };
    }

    const docno = response.docno;

    const new_docno = `${docno + 1}`;

    return { docno: new_docno, date: new Date() };
  }

  async function getAllBulkParentItem({ logTrace, queryString }) {
    const knex = this;
    const { search } = queryString
    const query = knex(`${ITEM.NAME} as parent`)
      .distinct([
        `parent.${ITEM.COLUMNS.ID}`,
        `parent.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `parent.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `parent.${ITEM.COLUMNS.PRO_DESCRIPTION}`,
        `parent.${ITEM.COLUMNS.BULK_ITEM}`,
        `parent.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
        `parent.${ITEM.COLUMNS.BALANCE}`
      ])
      .join(
        `${ITEM.NAME} as child`,
        `child.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
        `parent.${ITEM.COLUMNS.ID}`
      )
      .where(`parent.${ITEM.COLUMNS.BULK_ITEM}`, true)
      .andWhere(`parent.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`parent.${ITEM.COLUMNS.TYPE_ID}`, 1);

    if (search && search.length > 0) {
      query.where(function () {
        this.where(ITEM.COLUMNS.PRODUCT_NAME, "ilike", `%${search}%`)
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get All Bulk Parent Products",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function getChildItemByParentId({ params, logTrace }) {
    const knex = this;

    const { product_code } = params;

    const productDetails = await knex(ITEM.NAME)
      .select(ITEM.COLUMNS.ID)
      .whereRaw(
        `CAST(${ITEM.COLUMNS.PRODUCT_CODE} AS TEXT) ILIKE ?`,
        [`%${String(product_code).trim()}%`]
      )
      .first();

    if (!productDetails) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Product not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const { id: parentId } = productDetails;
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
    const { status, search, from_date, to_date, planning_no } = queryString;

    const query = knex
      .select([
        `${PLANNING_HDR.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`
      ])
      .from(`${PLANNING_HDR.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.PROD_ID}`
      )
    if (planning_no) {
      query.whereRaw(
        `${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.ID} = ?`, [planning_no]
      );
    }

    if (from_date) {
      query.whereRaw(
        `DATE(${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.DATE}) >= ?`, [from_date]
      );
    }

    if (to_date) {
      query.whereRaw(
        `DATE(${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.DATE}) <= ?`, [to_date]
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get All Packing Planning Records with Header and Detail",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Packing Planning data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;

  }



  // async function getPackingPlanningById({ params, logTrace }) {
  //   const knex = this;
  //   const { id } = params;

  //   // Header query
  //   const headerQuery = knex
  //     .select(
  //       `${PLANNING_HDR.NAME}.*`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as parent_product_name`
  //     )
  //     .from(PLANNING_HDR.NAME)
  //     .leftJoin(
  //       ITEM.NAME,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //       `${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.PROD_ID}`
  //     )
  //     .where(`${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.ID}`, id)
  //     .first();


  //   logQuery({
  //     logger: fastify.log,
  //     query: headerQuery,
  //     context: "Get Packing Planning Header By ID",
  //     logTrace
  //   });

  //   const header = await headerQuery;

  //   if (!header) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "FMCG Packing Planning not found",
  //       property: "",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   // Details query
  //   const detailsQuery = knex
  //     .select(
  //       `${PLANNING_DTL.NAME}.*`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRO_DESCRIPTION}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_WEIGHT}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE}`,
  //       `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
  //     )
  //     .from(PLANNING_DTL.NAME)
  //     .leftJoin(
  //       `${ITEM.NAME}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
  //       `${PLANNING_DTL.NAME}.${PLANNING_DTL.COLUMNS.PROD_ID}`
  //     )
  //     .leftJoin(
  //       `${UNITS.NAME} as ${UNITS.NAME}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
  //       `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
  //     )
  //     .where(`${PLANNING_DTL.COLUMNS.PL_HDR_ID}`, id);

  //   logQuery({
  //     logger: fastify.log,
  //     query: detailsQuery,
  //     context: "Get Packing Planning Details By Header ID",
  //     logTrace
  //   });

  //   const details = await detailsQuery;

  //   return {
  //     ...header,
  //     details
  //   };
  // }

  async function getPackingPlanningById({ params, logTrace }) {
    const knex = this;
    const { id } = params;

    // Header query
    const headerQuery = knex
      .select(
        `${PLANNING_HDR.NAME}.*`,
        `${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.DATE} as manufacture_date`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as parent_product_name`
      )
      .from(PLANNING_HDR.NAME)
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.PROD_ID}`
      )
      .where(`${PLANNING_HDR.NAME}.${PLANNING_HDR.COLUMNS.ID}`, id)
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
        message: "FMCG Packing Planning not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Details query
    const detailsQuery = knex
      .select(
        `${PLANNING_DTL.NAME}.*`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRO_DESCRIPTION}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PARENT_PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_WEIGHT}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_TYPE_ID} as expiry_type_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.EXPIRY_VALUE} as expiry_value`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
      )
      .from(PLANNING_DTL.NAME)
      .leftJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${PLANNING_DTL.NAME}.${PLANNING_DTL.COLUMNS.PROD_ID}`
      )
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${PLANNING_DTL.COLUMNS.PL_HDR_ID}`, id);

    logQuery({
      logger: fastify.log,
      query: detailsQuery,
      context: "Get Packing Planning Details By Header ID",
      logTrace
    });

    const details = await detailsQuery;

    // Add expiry_date calculation
    const enrichedDetails = details.map(item => {
      let expiry_date = null;
      const expiryValue = Number(item.expiry_value);
      const expiryType = Number(item.expiry_type_id);
      const manufacture_date = header.manufacture_date;

      if (!isNaN(expiryValue) && expiryValue > 0 && manufacture_date) {
        expiry_date = new Date(manufacture_date);
        if (expiryType === 1) {
          expiry_date.setMonth(expiry_date.getMonth() + expiryValue);
        } else if (expiryType === 2) {
          expiry_date.setDate(expiry_date.getDate() + expiryValue);
        }
      }

      return {
        ...item,
        expiry_date: expiry_date ? expiry_date : null
      };
    });

    return {
      ...header,
      details: enrichedDetails
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
      const { pl_prodid, pl_qty } = body;
      // Step 1: Insert into PLANNING_HDR
      const [planningMasterResponse] = await trx(PACKING_PLANNING_MASTER.NAME)
        .returning(PACKING_PLANNING_MASTER.COLUMNS.ID)
        .insert({
          [PACKING_PLANNING_MASTER.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PACKING_PLANNING_MASTER.COLUMNS.COMPANY_ID]: userDetails.company_id,
          [PACKING_PLANNING_MASTER.COLUMNS.DOC_DATE]: body.pl_date || now,
          [PACKING_PLANNING_MASTER.COLUMNS.PLANNING_TYPE_ID]: body.pl_packtype || 0,
          [PACKING_PLANNING_MASTER.COLUMNS.PLANNING_BATCH_NO]: body.pl_batchno,
          [PACKING_PLANNING_MASTER.COLUMNS.PARENT_PROD_ID]: body.pl_prodid,
          [PACKING_PLANNING_MASTER.COLUMNS.PARENT_PROD_QTY]: body.pl_qty,
          [PACKING_PLANNING_MASTER.COLUMNS.PLANNING_TOTAL_WEIGHT]: body.pl_totweight,
          [PACKING_PLANNING_MASTER.COLUMNS.PLANNING_TOTAL_ITEMS]: Number(body.planning_details.length),
          [PACKING_PLANNING_MASTER.COLUMNS.INDENT_NO]: Number(body.pl_packtype) === 0 ? 0 : body.pl_indentno,
          [PACKING_PLANNING_MASTER.COLUMNS.IS_ACTIVE]: true,
          [PACKING_PLANNING_MASTER.COLUMNS.CREATED_AT]: now,
          [PACKING_PLANNING_MASTER.COLUMNS.CREATED_BY]: userDetails.id
        });

      const planningMasterId = planningMasterResponse.id;
      const docno = `${planningMasterId}`;

      // Step 2: Update PLANNING_HDR with docno (same as ID or custom logic)
      await trx(PACKING_PLANNING_MASTER.NAME)
        .where(PACKING_PLANNING_MASTER.COLUMNS.ID, planningMasterId)
        .update({ [PACKING_PLANNING_MASTER.COLUMNS.DOC_NO]: docno });

      // Step 3: Insert into PLANNING_DTL
      if (Array.isArray(body.planning_details) && body.planning_details.length) {
        const planningDetails = body.planning_details.map((detail, index) => ({
          [PACKING_PLANNING_DETAILS.COLUMNS.PLANNING_MST_ID]: planningMasterId,
          [PACKING_PLANNING_DETAILS.COLUMNS.FINANCIAL_YEAR]: financialYear,
          [PACKING_PLANNING_DETAILS.COLUMNS.COMPANY_ID]: userDetails.company_id,
          [PACKING_PLANNING_DETAILS.COLUMNS.SERIAL_NO]: index + 1,
          [PACKING_PLANNING_DETAILS.COLUMNS.PROD_ID]: detail.pl_prodid,
          [PACKING_PLANNING_DETAILS.COLUMNS.QTY]: detail.pl_qty,
          [PACKING_PLANNING_DETAILS.COLUMNS.WEIGHT]: detail.pd_weight,
          [PACKING_PLANNING_DETAILS.COLUMNS.CREATED_AT]: now,
          [PACKING_PLANNING_DETAILS.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(PACKING_PLANNING_DETAILS.NAME).insert(planningDetails);

        //update stock ledeger parent stock less
        // Check if stock already exists for the product and date
        const existingStock = await trx(STOCKLEDGER.NAME)
          .where({
            [STOCKLEDGER.COLUMNS.PROD_ID]: pl_prodid,
            [STOCKLEDGER.COLUMNS.DATE]: new Date()
          })
          .first();

        if (existingStock) {
          console.log(existingStock, "existing stock")
          // If stock exists, update the purchase quantity
          await trx(STOCKLEDGER.NAME)
            .where({
              [STOCKLEDGER.COLUMNS.PROD_ID]: pl_prodid,
              [STOCKLEDGER.COLUMNS.DATE]: new Date()
            })
            .update({
              [STOCKLEDGER.COLUMNS.SALE_QTY]: trx.raw(
                `${STOCKLEDGER.COLUMNS.SALE_QTY} + ? `,
                [pl_qty] // ✅ Single array
              ),
              [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
              [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
            });

        } else {
          // If stock does not exist, insert a new record
          await trx(STOCKLEDGER.NAME).insert({
            [STOCKLEDGER.COLUMNS.DATE]: new Date(), // Ensure date is valid
            [STOCKLEDGER.COLUMNS.PROD_ID]: pl_prodid, // Mandatory field
            [STOCKLEDGER.COLUMNS.SALE_QTY]: pl_qty, // Default to 0 if missing,
            [STOCKLEDGER.COLUMNS.SALES_RETURN_QTY]: 0, // Default to 0 if missing
            [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1, // Ensure company ID consistency
            [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id, // Record creator ID
            [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,// Allow null warehouse ID
            [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date() // Ensure date is valid
          });
        }

        // Step 6: Insert or Update Stock Ledger
        if (Array.isArray(body.planning_details)) {
          await Promise.all(body.planning_details.map(async (element) => {
            const receivedQty = parseFloat(element.pl_qty) || 0;

            // Check if stock already exists for the product and date
            const existingStock = await trx(STOCKLEDGER.NAME)
              .where({
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.pl_prodid,
                [STOCKLEDGER.COLUMNS.DATE]: new Date()
              })
              .first();

            if (existingStock) {
              console.log(existingStock, "existing stock")
              // If stock exists, update the purchase quantity
              await trx(STOCKLEDGER.NAME)
                .where({
                  [STOCKLEDGER.COLUMNS.PROD_ID]: element.pl_prodid,
                  [STOCKLEDGER.COLUMNS.DATE]: new Date()
                })
                .update({
                  [STOCKLEDGER.COLUMNS.PUR_QTY]: trx.raw(
                    `${STOCKLEDGER.COLUMNS.PUR_QTY} + ? `,
                    [element.pl_qty] // ✅ Single array
                  ),
                  [STOCKLEDGER.COLUMNS.UPDATED_AT]: new Date(),
                  [STOCKLEDGER.COLUMNS.UPDATED_BY]: userDetails.id
                });

            } else {
              // If stock does not exist, insert a new record
              await trx(STOCKLEDGER.NAME).insert({
                [STOCKLEDGER.COLUMNS.DATE]: new Date(), // Ensure date is valid
                [STOCKLEDGER.COLUMNS.PROD_ID]: element.pl_prodid, // Mandatory field
                [STOCKLEDGER.COLUMNS.PUR_QTY]: element.pl_qty, // Default to 0 if missing,
                [STOCKLEDGER.COLUMNS.PUR_RET_QTY]: 0, // Default to 0 if missing
                [STOCKLEDGER.COLUMNS.COMPANY_ID]: 1, // Ensure company ID consistency
                [STOCKLEDGER.COLUMNS.CREATED_BY]: userDetails.id, // Record creator ID
                [STOCKLEDGER.COLUMNS.WH_ID]: body.wh_id || 1,// Allow null warehouse ID
                [STOCKLEDGER.COLUMNS.CREATED_AT]: new Date() // Ensure date is valid
              });
            }
           
          }));
        }


      }

      return { success: true };
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
      const { planning_id } = params;
      console.log("Planning ID:", params.planning_id);

      const existing = await trx(PLANNING_HDR.NAME)
        .where({
          [PLANNING_HDR.COLUMNS.ID]: planning_id,
        })
        .first();
      console.log(existing, "existing Data")

      if (!existing) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Packing Planning Header Id Not Found`,
          property: "",
          code: "NOT_FOUND"
        });
      }


      // Step 1: Update the PLANNING_HDR
      const updatedHdr = await trx(PLANNING_HDR.NAME)
        .where(PLANNING_HDR.COLUMNS.ID, planning_id)
        .update({
          [PLANNING_HDR.COLUMNS.YEAR]: financialYear,
          [PLANNING_HDR.COLUMNS.COM_ID]: userDetails.company_id,
          [PLANNING_HDR.COLUMNS.DOCNO]: body.docno,
          [PLANNING_HDR.COLUMNS.DATE]: body.pl_date || now,
          [PLANNING_HDR.COLUMNS.BATCH_NO]: body.pl_batchno,
          [PLANNING_HDR.COLUMNS.PROD_ID]: body.pl_prodid,
          [PLANNING_HDR.COLUMNS.QTY]: body.pl_qty,
          [PLANNING_HDR.COLUMNS.GRN_NO]: body.pl_grnno,
          [PLANNING_HDR.COLUMNS.IS_ACTIVE]: body.is_active,
          [PLANNING_HDR.COLUMNS.GRN_QTY]: body.pl_grnqty,
          [PLANNING_HDR.COLUMNS.PRE_QTY]: body.pl_preqty,
          [PLANNING_HDR.COLUMNS.BAL_DTL]: body.pl_baldtl,
          [PLANNING_HDR.COLUMNS.TOT_WEIGHT]: body.pl_totweight,
          [PLANNING_HDR.COLUMNS.PACK_TYPE]: body.pl_packtype,
          [PLANNING_HDR.COLUMNS.PACKED_QTY]: body.pl_packedqty,
          [PLANNING_HDR.COLUMNS.GRN_ID]: body.grn_id,
          [PLANNING_HDR.COLUMNS.UPDATED_AT]: now,
          [PLANNING_HDR.COLUMNS.UPDATED_BY]: userDetails.id
        });

      // Step 2: Delete existing details from PLANNING_DTL (Optional: based on your business logic)
      await trx(PLANNING_DTL.NAME)
        .where(PLANNING_DTL.COLUMNS.PL_HDR_ID, planning_id) // Delete the details related to this header ID
        .del();

      // Step 3: Insert new details into PLANNING_DTL (this assumes you're updating details as well)
      if (Array.isArray(body.planning_details) && body.planning_details.length) {
        const planningDetails = body.planning_details.map(detail => ({
          [PLANNING_DTL.COLUMNS.PL_HDR_ID]: planning_id,
          [PLANNING_DTL.COLUMNS.YEAR]: financialYear,
          [PLANNING_DTL.COLUMNS.COM_ID]: userDetails.company_id,
          [PLANNING_DTL.COLUMNS.PROD_ID]: detail.pl_prodid,
          [PLANNING_DTL.COLUMNS.QTY]: detail.pl_qty,
          [PLANNING_DTL.COLUMNS.WEIGHT]: detail.pd_weight,
          [PLANNING_DTL.COLUMNS.UPDATED_AT]: now,
          [PLANNING_DTL.COLUMNS.UPDATED_BY]: userDetails.id
        }));

        await trx(PLANNING_DTL.NAME).insert(planningDetails);
      }

      await trx(PURCHASE_FMCG_DETAILS.NAME)
        .where(PURCHASE_FMCG_DETAILS.COLUMNS.ID, body.grn_id)
        .andWhere(PURCHASE_FMCG_DETAILS.COLUMNS.PRODUCT_ID, body.pl_prodid)
        .increment(PURCHASE_FMCG_DETAILS.COLUMNS.PACK_QUANTITY, body.pd_weight);


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
    getPackingPlanningById,
    getGrnForParentProduct
  };
}

module.exports = fmcgPackingPlanningRepo;
