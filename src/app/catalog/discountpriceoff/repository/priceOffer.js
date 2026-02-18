const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const crypto = require("crypto");
const { logQuery } = require("../../../commons/helpers");
const { PRICEOFF, PRICEOFF_OUTLET, PRICEOFF_PARTNER, PRICEOFF_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { parse } = require("csv-parse/sync");
const excelImportRepo = require("../../../Excelupload/repository/excelmport");


function OfferMasterRepo(fastify) {

  //   async function getOfferMasterPaginate({ queryString, params, logTrace }) {
  //     const knex = this;
  //     const { status, search, from_date, to_date } = queryString;

  //     // const query = knex
  //     //   .select([
  //     //     `${PRICEOFF.NAME}.*`,
  //     //     `${ITEM.NAME}.pro_name as product_name`, //  product name 
  //     //   ])
  //     //   .from(`${PRICEOFF.NAME}`)
  //     //   .leftJoin(
  //     //     `${ITEM.NAME}`,
  //     //     `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //     //     `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`
  //     //   )
  //     //   .orderBy(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`, "DESC");

  //     const query = knex
  //       .select([
  //         knex.raw('DISTINCT ON (??.??) ??.*', [PRICEOFF.NAME, PRICEOFF.COLUMNS.PID, PRICEOFF.NAME]),
  //         knex.raw('??.?? as ??', [ITEM.NAME, 'pro_name', 'product_name'])
  //       ])
  //       .from(PRICEOFF.NAME)
  //       .leftJoin(
  //         ITEM.NAME,
  //         `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //         `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`
  //       )
  //       .orderBy([
  //         { column: `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID}`, order: 'desc' },
  //         { column: `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`, order: 'desc' }
  //       ]);

  //     query.whereRaw(`
  //   ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM}::date <= CURRENT_DATE
  //   AND ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}::date >= CURRENT_DATE
  // `);

  //     if (Number(status) && Number(status) == 1) {
  //       query.where(
  //         `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`,
  //         1
  //       );
  //     }

  //     if (Number(status) && Number(status) == 2) {
  //       query.where(
  //         `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`,
  //         0
  //       );
  //     }

  //     if (search && search.length >= 3) {
  //       query.where(function () {
  //         this.where(PRICEOFF.COLUMNS.PNAME, "ilike", `%${search}%`);
  //       });
  //     }

  //     if (!from_date == '') {
  //       query.whereRaw(
  //         `DATE(${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM}) >= ?`, from_date
  //       )
  //     }
  //     if (!to_date == '') {
  //       query.whereRaw(
  //         `DATE(${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}) <= ?`, to_date
  //       )
  //     }
  //     logQuery({
  //       logger: fastify.log,
  //       query,
  //       context: "Get Price Offer Master",
  //       logTrace
  //     });
  //     const response = await query.paginate({
  //       pageSize: params.page_size, // Customize as needed
  //       currentPage: params.current_page // Customize as needed
  //     });
  //     if (!response.data.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "Price Offer  data not found",
  //         property: "",
  //         code: "NOT_FOUND"
  //       });
  //     }


  //     const responsewith_outletdetails = await Promise.all(
  //       response.data.map(async offers => {
  //         const outlets_lines = await knex
  //           .select([
  //             `${OUTLETS.NAME}.*`,
  //           ])
  //           .from(`${PRICEOFF_OUTLET.NAME} as ${PRICEOFF_OUTLET.NAME}`)
  //           .leftJoin(
  //             `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
  //             `${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`,
  //             `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //           )
  //           .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offers.pid);

  //         const partner_lines = await knex
  //           .select([
  //             `${PRICEOFF_PARTNER.NAME}.*`,
  //           ])
  //           .from(`${PRICEOFF_PARTNER.NAME} as ${PRICEOFF_PARTNER.NAME}`)
  //           // .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offers.id)
  //           .where(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`, offers.pid);


  //         return { ...offers, outlets_lines, partner_lines };
  //       })
  //     );


  //     return {
  //       data: responsewith_outletdetails,
  //       meta: response.meta
  //     };
  //   }

  async function getOfferMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date, etype, prod_code } = queryString;

    const baseQuery = knex
      .from(PRICEOFF.NAME)
      .leftJoin(
        ITEM.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`
      )
      .select([
        knex.raw(`
        DISTINCT ON (
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PPARTNER},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PNAME},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.AMOUNT},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PCOMPAMT},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PLOCAMT},
          ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PMRP}
        )
        CASE
          WHEN ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ETYPE} = 0 THEN 'discount'
          WHEN ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ETYPE} = 1 THEN 'price off'
          ELSE 'special price'
        END AS type
      `),

        `${PRICEOFF.NAME}.*`,
        `${ITEM.NAME}.pro_name AS product_name`
      ]);

    if (!from_date && !to_date) {
      baseQuery.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}::date >= CURRENT_DATE`);
    }

    if (from_date) {
      baseQuery.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM}::date >= ?`, [from_date]);
    }

    if (to_date) {
      baseQuery.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}::date <= ?`, [to_date]);
    }

    if (Number(status) === 1) {
      baseQuery.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 1);
    } else if (Number(status) === 2) {
      baseQuery.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 0);
    }

    if (search && search.length >= 3) {
      baseQuery.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PNAME}`, "ilike", `%${search}%`);
    }


    if (etype) {
      baseQuery.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ETYPE}`, etype);
    }

    if (prod_code) {
      baseQuery.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, prod_code);
    }

    baseQuery.orderByRaw(`
      ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID} ASC,
      ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE} ASC
  `);

    const countQuery = knex
      .count("* as total")
      .from(
        knex
          .from(PRICEOFF.NAME)
          .leftJoin(
            ITEM.NAME,
            `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
            `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`
          )
          .select(
            knex.raw(`
          DISTINCT ON (
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PPARTNER},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PNAME},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.AMOUNT},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PCOMPAMT},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PLOCAMT},
            ${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PMRP}
          )
          ${PRICEOFF.NAME}.pid
        `)
          )
          .modify(qb => {
            if (!from_date && !to_date) {
              qb.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}::date >= CURRENT_DATE`);
            }
            if (from_date) {
              qb.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PFROM}::date >= ?`, [from_date]);
            }
            if (to_date) {
              qb.whereRaw(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PTO}::date <= ?`, [to_date]);
            }
            if (Number(status) === 1) {
              qb.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 1);
            } else if (Number(status) === 2) {
              qb.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 0);
            }
            if (search && search.length >= 3) {
              qb.where(inner => {
                inner.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PNAME}`, "ilike", `%${search}%`)
                  .orWhere(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, "ilike", `%${search}%`)
                  .orWhere(`${ITEM.NAME}.pro_name`, "ilike", `%${search}%`);
              });
            }
            if (etype) {
              qb.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ETYPE}`, etype);
            }
            if (prod_code) {
              qb.where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, prod_code);
            }
          })
          .as("subquery")
      );

    const [{ total }] = await countQuery;

    const pageSize = params.page_size || 10;
    const currentPage = params.current_page || 1;
    const offset = (currentPage - 1) * pageSize;

    const data = await baseQuery.limit(pageSize).offset(offset);

    // console.log('total data', total);

    if (!data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price Offer data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const responseWithDetails = await Promise.all(
      data.map(async offer => {
        // const outlets_lines = await knex
        //   .select("o.*")
        //   .from(`${PRICEOFF_OUTLET.NAME} as po`)
        //   .leftJoin(`${OUTLETS.NAME} as o`, `po.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`, `o.${OUTLETS.COLUMNS.ID}`)
        //   .where(`po.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offer.pid);

        const outlets_rows = await knex
          .distinct("po.outlet_id")
          .from(`${PRICEOFF_OUTLET.NAME} as po`)
          .leftJoin(`${OUTLETS.NAME} as o`, `po.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`, `o.${OUTLETS.COLUMNS.ID}`)
          .where(`po.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offer.pid);

        const outlets_lines = outlets_rows.map(r => r.outlet_id);

        // console.log('outletId', outlets_lines);

        const partner_lines = await knex
          .select("pp.*")
          .from(`${PRICEOFF_PARTNER.NAME} as pp`)
          .where(`pp.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`, offer.pid);

        return { ...offer, outlets_lines, partner_lines };
      })
    );

    return {
      data: responseWithDetails,
      meta: {
        pagination: {
          total: Number(total),
          page: currentPage,
          page_size: pageSize,
          total_pages: Math.ceil(total / pageSize)
        }
      }
    };
  }


  async function postOfferMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    //console.log("outlet",body.outlet)
    if (Array.isArray(body.outlet) && body.outlet.length > 0) {
      console.log("outlet_check", body.outlet)
      const query = knex(PRICEOFF.NAME)
        .join(
          PRICEOFF_OUTLET.NAME,
          `${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`,
          `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID}`
        )
        .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, body.prod_code)
        .whereIn(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet)
        .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 1)
        .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [body.pfrom, body.pto])
            .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [body.pfrom, body.pto])
            .orWhere((subquery) => {
              subquery
                .where(`${PRICEOFF.COLUMNS.PFROM}`, '<=', body.pfrom)
                .andWhere(`${PRICEOFF.COLUMNS.PTO}`, '>=', body.pto);
            });
        });

      logQuery({
        logger: fastify.log,
        query,
        context: "Get Priceoff outlet check query",
        logTrace
      });

      const exists_response = await query;

      console.log("exists_response", exists_response);

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer already exists for the specified outlets, get products, and date range",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }

    if (Array.isArray(body.ppartner) && body.ppartner.length > 0) {
      const query = knex(PRICEOFF.NAME)
        .join(
          PRICEOFF_PARTNER.NAME,
          `${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`,
          `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID}`
        )
        .where(`${PRICEOFF.COLUMNS.PROD_CODE}`, body.prod_code)
        .whereIn(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID}`, body.ppartner)
        .where(`${PRICEOFF.COLUMNS.PACTIVE}`, 1)
        .where(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE}`, true)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [body.pfrom, body.pto])
            .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [body.pfrom, body.pto])
            .orWhere((subquery) => {
              subquery
                .where(`${PRICEOFF.COLUMNS.PFROM}`, '<=', body.pfrom)
                .andWhere(`${PRICEOFF.COLUMNS.PTO}`, '>=', body.pto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer already exists for this partner, product, and date range",
          property: "",
          code: "NOT_ACCEPTABLE",
        });
      }
    }

    // const query_insert = await knex(`${PRICEOFF.NAME}`)
    //   .returning(['id']) // Fixed `retrning` typo
    //   .insert({
    //     [PRICEOFF.COLUMNS.PROD_CODE]: body.prod_code,
    //     [PRICEOFF.COLUMNS.AMOUNT]: body.amount,
    //     [PRICEOFF.COLUMNS.ETYPE]: body.etype,
    //     [PRICEOFF.COLUMNS.PFROM]: body.pfrom,
    //     [PRICEOFF.COLUMNS.PTO]: body.pto,
    //     [PRICEOFF.COLUMNS.OUTLET]: Array.isArray(body.outlet) ? body.outlet.join(",") : null,
    //     [PRICEOFF.COLUMNS.PNAME]: body.pname,
    //     [PRICEOFF.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
    //     [PRICEOFF.COLUMNS.PCOMPAMT]: body.pcompamt,
    //     [PRICEOFF.COLUMNS.PLOCAMT]: body.plocamt,
    //     [PRICEOFF.COLUMNS.PACTIVE]: body.pactive,
    //     [PRICEOFF.COLUMNS.OID]: body.oid,
    //     [PRICEOFF.COLUMNS.DOWNDT]: body.downdt,
    //     [PRICEOFF.COLUMNS.STATUS]: body.status,
    //     [PRICEOFF.COLUMNS.UID]: userDetails.id,
    //     [PRICEOFF.COLUMNS.PMRP]: body.pmrp,
    //     [PRICEOFF.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //     [PRICEOFF.COLUMNS.CREATED_BY]: userDetails.id,
    //     [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
    //   });



    // // Ensure insert was successful
    // if (!query_insert || query_insert.length === 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_IMPLEMENTED,
    //     message: "Error while creating price offer master",
    //     property: "",
    //     code: "NOT_IMPLEMENTED"
    //   });
    // }

    // const offerId = query_insert[0].id;

    // // Insert into related tables if data is provided
    // const outletInserts = (Array.isArray(body.outlet) && body.outlet.length > 0) ?
    //   body.outlet.map(outlet_id => ({
    //     [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: offerId,
    //     [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
    //     [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
    //     [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //     [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
    //     [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
    //   })) : [];

    // const partnerInserts = (Array.isArray(body.ppartner) && body.ppartner.length > 0) ?
    //   body.ppartner.map(partner => ({
    //     [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: offerId,
    //     [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: partner,
    //     [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
    //     [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //     [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
    //     [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
    //   })) : [];

    // await Promise.all([
    //   outletInserts.length > 0 && knex(PRICEOFF_OUTLET.NAME).insert(outletInserts),
    //   partnerInserts.length > 0 && knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts)
    // ]);

    // // Insert log entry
    // await knex(PRICEOFF_LOGS.NAME).insert({
    //   [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
    //   [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: offerId,
    //   [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
    //   [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //   [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
    // });

    // Get max(pid) before inserting
    const pidResult = await knex(PRICEOFF.NAME)
      .max(`${PRICEOFF.COLUMNS.PID} as maxPid`)
      .first();

    const nextPid = (pidResult?.maxPid || 0) + 1;
    const outlets = Array.isArray(body.outlet) && body.outlet.length > 0 ? body.outlet : [null];

    for (const outlet of outlets) {
      // Insert into PRICEOFF
      const query_insert = await knex(PRICEOFF.NAME)
        .returning(['id'])
        .insert({
          [PRICEOFF.COLUMNS.PID]: nextPid,
          [PRICEOFF.COLUMNS.PROD_CODE]: body.prod_code,
          [PRICEOFF.COLUMNS.AMOUNT]: body.amount,
          [PRICEOFF.COLUMNS.ETYPE]: body.etype,
          [PRICEOFF.COLUMNS.PFROM]: body.pfrom,
          [PRICEOFF.COLUMNS.PTO]: body.pto,
          [PRICEOFF.COLUMNS.OUTLET]: outlet ?? null,
          [PRICEOFF.COLUMNS.PNAME]: body.pname,
          [PRICEOFF.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
          [PRICEOFF.COLUMNS.PCOMPAMT]: body.pcompamt,
          [PRICEOFF.COLUMNS.PLOCAMT]: body.plocamt,
          [PRICEOFF.COLUMNS.PACTIVE]: body.pactive,
          [PRICEOFF.COLUMNS.OID]: outlet ?? null,
          [PRICEOFF.COLUMNS.DOWNDT]: body.downdt,
          // [PRICEOFF.COLUMNS.STATUS]: body.status,
          [PRICEOFF.COLUMNS.UID]: userDetails.id,
          [PRICEOFF.COLUMNS.PMRP]: body.pmrp,
          [PRICEOFF.COLUMNS.COMPANY_ID]: body.company_id || 1,
          [PRICEOFF.COLUMNS.CREATED_BY]: userDetails.id,
          [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const offerId = query_insert[0].id;

      // // Insert into PRICEOFF_OUTLET (for this specific outlet)
      // const outletInsert = outlet ? {
      //   [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: offerId,
      //   [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet,
      //   [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
      //   [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
      //   [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
      //   [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      // } : null;

      // // Insert into PRICEOFF_PARTNER (partners are same for all outlets)
      // const partnerInserts = (Array.isArray(body.ppartner) && body.ppartner.length > 0)
      //   ? body.ppartner.map(partner => ({
      //     [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: offerId,
      //     [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: partner,
      //     [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
      //     [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: body.company_id || 1,
      //     [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
      //     [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
      //   }))
      //   : [];

      // await Promise.all([
      //   outletInsert && knex(PRICEOFF_OUTLET.NAME).insert(outletInsert),
      //   partnerInserts.length > 0 && knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts)
      // ]);

      // Insert log entry
      await knex(PRICEOFF_LOGS.NAME).insert({
        [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: offerId,
        [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: body, // store request JSON
        [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    }
    // Insert into related tables if data is provided
    const outletInserts = (Array.isArray(body.outlet) && body.outlet.length > 0) ?
      body.outlet.map(outlet_id => ({
        [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: nextPid,
        [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
        [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];

    const partnerInserts = (Array.isArray(body.ppartner) && body.ppartner.length > 0) ?
      body.ppartner.map(partner => ({
        [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: nextPid,
        [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: partner,
        [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
        [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
        [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];

    await Promise.all([
      outletInserts.length > 0 && knex(PRICEOFF_OUTLET.NAME).insert(outletInserts),
      partnerInserts.length > 0 && knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts)
    ]);


    return { success: true };
  }

  async function putOfferMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { pid } = params;

    // Check if the offer exists
    const existingOffer = await knex(PRICEOFF.NAME)
      .where(PRICEOFF.COLUMNS.PID, pid)
      // .where(PRICEOFF.COLUMNS.PACTIVE, 1)
      .first();

    if (!existingOffer) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price Offer not found or inactive",
        property: "",
        code: "NOT_FOUND"
      });
    }
    let offerId;
    offerId = existingOffer[PRICEOFF.COLUMNS.ID];
    let priceofferId;
    priceofferId = existingOffer[PRICEOFF.COLUMNS.PID];

    // return offerId;
    // Check for conflicting offers for outlets
    if (Array.isArray(body.outlet) && body.outlet.length > 0) {
      console.log("offerId1", offerId);
      const query = knex(PRICEOFF.NAME)
        .join(
          PRICEOFF_OUTLET.NAME,
          `${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`,
          `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID}`
        )
        .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, body.prod_code)
        .whereIn(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet)
        .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 1)
        .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        .whereNot(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`, offerId)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [body.pfrom, body.pto])
            .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [body.pfrom, body.pto])
            .orWhere((subquery) => {
              subquery
                .where(`${PRICEOFF.COLUMNS.PFROM}`, '<=', body.pfrom)
                .andWhere(`${PRICEOFF.COLUMNS.PTO}`, '>=', body.pto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer already exists for the specified outlets, product, and date range",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }

    // Check for conflicting offers for partners
    if (Array.isArray(body.ppartner) && body.ppartner.length > 0) {
      const query = knex(PRICEOFF.NAME)
        .join(
          PRICEOFF_PARTNER.NAME,
          `${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`,
          `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PID}`
        )
        .where(`${PRICEOFF.COLUMNS.PROD_CODE}`, body.prod_code)
        .whereIn(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID}`, body.ppartner)
        .where(`${PRICEOFF.COLUMNS.PACTIVE}`, 1)
        .where(`${PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE}`, true)
        .whereNot(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`, offerId)
        .andWhere((builder) => {
          builder
            .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [body.pfrom, body.pto])
            .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [body.pfrom, body.pto])
            .orWhere((subquery) => {
              subquery
                .where(`${PRICEOFF.COLUMNS.PFROM}`, '<=', body.pfrom)
                .andWhere(`${PRICEOFF.COLUMNS.PTO}`, '>=', body.pto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer already exists for this partner, product, and date range",
          property: "",
          code: "NOT_ACCEPTABLE",
        });
      }
    }

    // // Update the offer
    // const query_update = knex(`${PRICEOFF.NAME}`)
    //   .where(`${PRICEOFF.COLUMNS.ID}`, id)
    //   .update({
    //     [PRICEOFF.COLUMNS.PROD_CODE]: body.prod_code,
    //     [PRICEOFF.COLUMNS.AMOUNT]: body.amount,
    //     [PRICEOFF.COLUMNS.ETYPE]: body.etype,
    //     [PRICEOFF.COLUMNS.PFROM]: body.pfrom,
    //     [PRICEOFF.COLUMNS.PTO]: body.pto,
    //     [PRICEOFF.COLUMNS.OUTLET]: Array.isArray(body.outlet) ? body.outlet.join(",") : null,
    //     [PRICEOFF.COLUMNS.PNAME]: body.pname,
    //     [PRICEOFF.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
    //     [PRICEOFF.COLUMNS.PCOMPAMT]: body.pcompamt,
    //     [PRICEOFF.COLUMNS.PLOCAMT]: body.plocamt,
    //     [PRICEOFF.COLUMNS.PACTIVE]: body.pactive,
    //     [PRICEOFF.COLUMNS.OID]: body.oid,
    //     [PRICEOFF.COLUMNS.DOWNDT]: body.downdt,
    //     [PRICEOFF.COLUMNS.STATUS]: body.status,
    //     [PRICEOFF.COLUMNS.UID]: userDetails.id,
    //     [PRICEOFF.COLUMNS.PMRP]: body.pmrp,
    //     [PRICEOFF.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //     [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
    //   });
    // const query = await query_update;

    // await knex(PRICEOFF.NAME)
    //   .where(PRICEOFF.COLUMNS.ID, id)
    //   .delete();
    await knex(PRICEOFF.NAME)
      .where(PRICEOFF.COLUMNS.PID, pid)
      .delete();

    // Get max(pid) before inserting
    const pidResult = await knex(PRICEOFF.NAME)
      .max(`${PRICEOFF.COLUMNS.PID} as maxPid`)
      .first();

    const nextPid = (pidResult?.maxPid || 0) + 1;
    const outlets = Array.isArray(body.outlet) && body.outlet.length > 0 ? body.outlet : [null];

    for (const outlet of outlets) {
      // Insert into PRICEOFF
      const query_insert = await knex(PRICEOFF.NAME)
        .returning(['id'])
        .insert({
          [PRICEOFF.COLUMNS.PID]: nextPid,
          [PRICEOFF.COLUMNS.PROD_CODE]: body.prod_code,
          [PRICEOFF.COLUMNS.AMOUNT]: body.amount,
          [PRICEOFF.COLUMNS.ETYPE]: body.etype,
          [PRICEOFF.COLUMNS.PFROM]: body.pfrom,
          [PRICEOFF.COLUMNS.PTO]: body.pto,
          [PRICEOFF.COLUMNS.OUTLET]: outlet ?? null,
          [PRICEOFF.COLUMNS.PNAME]: body.pname,
          [PRICEOFF.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
          [PRICEOFF.COLUMNS.PCOMPAMT]: body.pcompamt,
          [PRICEOFF.COLUMNS.PLOCAMT]: body.plocamt,
          [PRICEOFF.COLUMNS.PACTIVE]: body.pactive,
          [PRICEOFF.COLUMNS.OID]: outlet ?? null,
          [PRICEOFF.COLUMNS.DOWNDT]: body.downdt,
          // [PRICEOFF.COLUMNS.STATUS]: body.status,
          [PRICEOFF.COLUMNS.UID]: userDetails.id,
          [PRICEOFF.COLUMNS.PMRP]: body.pmrp,
          [PRICEOFF.COLUMNS.COMPANY_ID]: body.company_id || 1,
          [PRICEOFF.COLUMNS.CREATED_BY]: userDetails.id,
          [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
        });

      const offerId = query_insert[0].id;

      // // Insert into PRICEOFF_OUTLET (for this specific outlet)
      // const outletInsert = outlet ? {
      //   [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: offerId,
      //   [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet,
      //   [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
      //   [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
      //   [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
      //   [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      // } : null;

      // // Insert into PRICEOFF_PARTNER (partners are same for all outlets)
      // const partnerInserts = (Array.isArray(body.ppartner) && body.ppartner.length > 0)
      //   ? body.ppartner.map(partner => ({
      //     [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: offerId,
      //     [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: partner,
      //     [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
      //     [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: body.company_id || 1,
      //     [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
      //     [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
      //   }))
      //   : [];

      // await Promise.all([
      //   outletInsert && knex(PRICEOFF_OUTLET.NAME).insert(outletInsert),
      //   partnerInserts.length > 0 && knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts)
      // ]);

      // Insert log entry
      await knex(PRICEOFF_LOGS.NAME).insert({
        [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: offerId,
        [PRICEOFF_LOGS.COLUMNS.OLD_DATA]: existingOffer,
        [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
        [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    }

    // logQuery({
    //   logger: fastify.log,
    //   query: query_update,
    //   context: "Update Priceoff  query",
    //   logTrace
    // });

    // Handle outlet updates
    if (Array.isArray(body.outlet) && body.outlet.length > 0) {
      await knex(PRICEOFF_OUTLET.NAME)
        .where(PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID, priceofferId)
        .delete();

      const outletInserts = body.outlet.map(outlet => ({
        [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: priceofferId,
        [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet,
        [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
        [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      }));

      if (outletInserts.length > 0) {
        await knex(PRICEOFF_OUTLET.NAME).insert(outletInserts);
      }
    }
    // Handle partner updates
    if (Array.isArray(body.ppartner) && body.ppartner.length > 0) {
      await knex(PRICEOFF_PARTNER.NAME)
        .where(PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID, priceofferId)
        .delete();

      const partnerInserts = body.ppartner.map(ppartner => ({
        [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: priceofferId,
        [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: ppartner,
        [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
        [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
        [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
        [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
      }));

      if (partnerInserts.length > 0) {
        await knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts);
      }
    }

    // // Insert log entry
    // await knex(PRICEOFF_LOGS.NAME).insert({
    //   [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: id,
    //   [PRICEOFF_LOGS.COLUMNS.OLD_DATA]: existingOffer,
    //   [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
    //   [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
    //   [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
    // });

    return { success: true };
  }
  async function deleteOfferMaster({ id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PRICEOFF.NAME).where(PRICEOFF.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OFFER_MASTER not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.UOM_ID,
    //   unit_id
    // );

    // const exists_response1 = await query1;

    // if (exists_response1.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "Unit is mapped with a product and cannot be deleted",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    const query_delete = knex(PRICEOFF.NAME)
      .where(PRICEOFF.COLUMNS.ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete Price Offer",
      logTrace
    });
    const response = await query_delete;
    const query_delete1 = knex(PRICEOFF_OUTLET.NAME)
      .where(PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete1,
      context: "delete PRICEOFF_OUTLET",
      logTrace
    });
    const response1 = await query_delete1;
    const query_delete2 = knex(PRICEOFF_PARTNER.NAME)
      .where(PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete2,
      context: "delete PRICEOFF_PARTNER",
      logTrace
    });
    const response2 = await query_delete2;


    // Insert log entry
    await knex(PRICEOFF_LOGS.NAME).insert({
      [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: id,
      [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: exists_response[0], //JsonB 
      [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });
    return { success: true };
  }
  async function getOfferMasterInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PRICEOFF.NAME}.*`,
        `${ITEM.NAME}.pro_name as product_name`, //  product name 
      ])
      .from(`${PRICEOFF.NAME}`)
      .leftJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`
      )
      .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`, params.id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Price Offer Master",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price Offer  data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_outletdetails = await Promise.all(
      response.map(async offers => {
        const outlets_lines = await knex
          .select([
            `${OUTLETS.NAME}.*`,
          ])
          .from(`${PRICEOFF_OUTLET.NAME} as ${PRICEOFF_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          // .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offers.id)
          .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offers.pid);
        const partner_lines = await knex
          .select([
            `${PRICEOFF_PARTNER.NAME}.*`,
          ])
          .from(`${PRICEOFF_PARTNER.NAME} as ${PRICEOFF_PARTNER.NAME}`)
          // .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`, offers.id)
          .where(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`, offers.pid);

        return { ...offers, outlets_lines, partner_lines };
      })
    );


    return responsewith_outletdetails[0];
  }

  async function postPriceOffExcel({ params, body, logTrace, userDetails }) {
    const knex = this;
    const successfulInserts = [];
    const failedInserts = [];

    const outletIds = body.outlet

    const parseIfArrayOrJSON = (input) => {
      const value = input?.value ?? input;
      if (Array.isArray(value)) return value;

      if (typeof value === 'object' && value !== null) return value;

      try {
        if (typeof value === "string") {
          if (value.trim() === '[object Object]') {
            console.warn("Received invalid stringified object. Please check data source.");
            return {};
          }
          const fixed = value.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
          return JSON.parse(fixed);
        }
        return [];
      } catch (e) {
        console.error("Failed to parse input:", value);
        return [];
      }
    };

    const outletIdArray = parseIfArrayOrJSON(outletIds);

    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
    const { headers: excelColumns, data: excelData } = excelColumnData;

    const allowedColumns = [
      "Code",
      "Amount",
      "Company",
      "Outlet",
      "MRP",
      "FromDate",
      "ToDate"
    ];

    const requiredColumns = [
      "Code",
      "Amount",
      "Company",
      "Outlet",
      "MRP",
      "FromDate",
      "ToDate"
    ];

    const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
    if (missingColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Missing required columns: ${missingColumns.join(", ")}`,
        code: "EXCEL_IMPORT_FAILED"
      });
    }
    const extraColumns = excelColumns.filter(col => !allowedColumns.includes(col));
    if (extraColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Invalid columns found: ${extraColumns.join(", ")}`,
        code: "EXCEL_IMPORT_FAILED"
      });
    }

    const cleanedExcelData = excelData.filter(row =>
      row &&
      Object.values(row).some(
        val => val !== undefined && val !== null && String(val).trim() !== ""
      )
    );

    cleanedExcelData.forEach((row, index) => {
      console.log(row.Code, "row.Code");

      console.log(typeof row.Code);

      if (isNaN(row.Code)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${index + 1}: Code must be a number`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Check if Amount, Company, Outlet, MRP are numbers
      ["Amount", "Company", "Outlet", "MRP"].forEach(field => {
        if (isNaN(row[field])) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: ${field} must be a number`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }
      });

      const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

      if (!dateRegex.test(row.FromDate) || !dateRegex.test(row.ToDate)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${index + 1}: Dates must be in MM/DD/YYYY format`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      const fromDate = new Date(row.FromDate);
      const toDate = new Date(row.ToDate);

      if (fromDate > toDate) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${index + 1}: FromDate must be before or equal to ToDate`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }
    });

    const codes = cleanedExcelData.map(row => row.Code);
    const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
    if (duplicateCodes.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Duplicate codes found: ${[...new Set(duplicateCodes)].join(", ")}`,
        code: "EXCEL_IMPORT_FAILED"
      });
    }
    cleanedExcelData.forEach((row, index) => {
      requiredColumns.forEach(column => {
        if (row[column] === undefined || row[column] === null || row[column] === "") {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${index + 1}: ${column} cannot be empty`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }
      });
    });

    let priceOff = null;

    function toDbDate(input) {
      if (!input) return null;

      const match = input.match(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(\d{4})$/);
      if (!match) return null;

      const dd = Number(match[1]);
      const mm = Number(match[2]);
      const yyyy = Number(match[3]);

      const date = new Date(yyyy, mm - 1, dd);

      // calendar validation
      if (
        date.getFullYear() !== yyyy ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd
      ) {
        return null;
      }

      return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')} 00:00:00`;
    }


    function getISTDateTime() {
      const date = new Date();

      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).replace(',', '');
    }

    // const downdt = 
    // console.log(downdt);

    // body will now be an array of inputs
    for (let i = 0; i < cleanedExcelData.length; i++) {
      const excelDataDetails = cleanedExcelData[i];

      const pfrom = toDbDate(excelDataDetails?.FromDate);
      const pto = toDbDate(excelDataDetails?.ToDate);

      if (!pfrom || !pto) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "FromDate / ToDate is missing or invalid",
          code: "INVALID_DATE"
        });
      }

      priceOff = {
        prod_code: String(excelDataDetails?.Code) || "",
        amount: Number(excelDataDetails?.Amount) || 0,
        etype: Number(body.etype?.value) || 1,
        pcompamt: Number(excelDataDetails?.Company) || 0,
        plocamt: Number(excelDataDetails?.Outlet) || 0,
        pmrp: Number(excelDataDetails?.MRP) || 0,
        pfrom: pfrom,
        pto: pto,
        downdt: getISTDateTime(),
        pactive: body.pactive?.value || 1,
        pname: body.pname?.value || "",
        status: body.status?.value || 1,
        uuid: crypto.randomUUID(),
        outlet: outletIdArray || []
      }

      try {

        // --- Duplicate check for outlets ---
        if (Array.isArray(priceOff.outlet) && priceOff.outlet.length > 0) {
          const query = knex(PRICEOFF.NAME)
            .join(
              PRICEOFF_OUTLET.NAME,
              `${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID}`,
              `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`
            )
            .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PROD_CODE}`, priceOff.prod_code)
            .whereIn(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.OUTLET_ID}`, priceOff.outlet)
            .where(`${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.PACTIVE}`, 1)
            .where(`${PRICEOFF_OUTLET.NAME}.${PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE}`, true)
            .andWhere((builder) => {
              builder
                .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [priceOff.pfrom, priceOff.pto])
                .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [priceOff.pfrom, priceOff.pto])
                .orWhere((subquery) => {
                  subquery
                    .where(`${PRICEOFF.COLUMNS.PFROM}`, "<=", priceOff.pfrom)
                    .andWhere(`${PRICEOFF.COLUMNS.PTO}`, ">=", priceOff.pto);
                });
            });

          const exists_response = await query;
          console.log(exists_response, "exists_response");


          if (exists_response.length > 0) {
            throw CustomError.create({
              httpCode: StatusCodes.NOT_ACCEPTABLE,
              message: "Offer already exists for the specified outlets and date range",
              property: "",
              code: "NOT_ACCEPTABLE",
            });
          }
        }

        // --- Duplicate check for partners ---
        if (Array.isArray(priceOff.ppartner) && priceOff.ppartner.length > 0) {
          const query = knex(PRICEOFF.NAME)
            .join(
              PRICEOFF_PARTNER.NAME,
              `${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID}`,
              `${PRICEOFF.NAME}.${PRICEOFF.COLUMNS.ID}`
            )
            .where(`${PRICEOFF.COLUMNS.PROD_CODE}`, priceOff.prod_code)
            .whereIn(
              `${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID}`,
              priceOff.ppartner
            )
            .where(`${PRICEOFF.COLUMNS.PACTIVE}`, 1)
            .where(`${PRICEOFF_PARTNER.NAME}.${PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE}`, true)
            .andWhere((builder) => {
              builder
                .whereBetween(`${PRICEOFF.COLUMNS.PFROM}`, [priceOff.pfrom, priceOff.pto])
                .orWhereBetween(`${PRICEOFF.COLUMNS.PTO}`, [priceOff.pfrom, priceOff.pto])
                .orWhere((subquery) => {
                  subquery
                    .where(`${PRICEOFF.COLUMNS.PFROM}`, "<=", priceOff.pfrom)
                    .andWhere(`${PRICEOFF.COLUMNS.PTO}`, ">=", priceOff.pto);
                });
            });

          const exists_response = await query;

          if (exists_response.length > 0) {
            throw CustomError.create({
              httpCode: StatusCodes.NOT_ACCEPTABLE,
              message: "Offer already exists for this partner, product, and date range",
              property: "",
              code: "NOT_ACCEPTABLE",
            });
          }
        }

        // --- Get max(pid) ---
        const pidResult = await knex(PRICEOFF.NAME)
          .max(`${PRICEOFF.COLUMNS.PID} as maxPid`)
          .first();

        const nextPid = (pidResult?.maxPid || 0) + 1;
        const outlets =
          Array.isArray(priceOff.outlet) && priceOff.outlet.length > 0
            ? priceOff.outlet
            : [null];

        for (const outlet of outlets) {
          // Insert into PRICEOFF
          const query_insert = await knex(PRICEOFF.NAME)
            .returning(["id"])
            .insert({
              [PRICEOFF.COLUMNS.PID]: nextPid,
              [PRICEOFF.COLUMNS.PROD_CODE]: priceOff.prod_code,
              [PRICEOFF.COLUMNS.AMOUNT]: priceOff.amount,
              [PRICEOFF.COLUMNS.ETYPE]: priceOff.etype,
              [PRICEOFF.COLUMNS.PFROM]: priceOff.pfrom,
              [PRICEOFF.COLUMNS.PTO]: priceOff.pto,
              [PRICEOFF.COLUMNS.OUTLET]: outlet ?? null,
              [PRICEOFF.COLUMNS.PNAME]: priceOff.pname,
              [PRICEOFF.COLUMNS.PPARTNER]: Array.isArray(priceOff.ppartner)
                ? priceOff.ppartner.join(",")
                : null,
              [PRICEOFF.COLUMNS.PCOMPAMT]: priceOff.pcompamt,
              [PRICEOFF.COLUMNS.PLOCAMT]: priceOff.plocamt,
              [PRICEOFF.COLUMNS.PACTIVE]: priceOff.pactive,
              [PRICEOFF.COLUMNS.OID]: outlet ?? null,
              [PRICEOFF.COLUMNS.DOWNDT]: priceOff.downdt,
              // [PRICEOFF.COLUMNS.STATUS]: priceOff.status,
              [PRICEOFF.COLUMNS.UID]: userDetails.id,
              [PRICEOFF.COLUMNS.PMRP]: priceOff.pmrp,
              [PRICEOFF.COLUMNS.COMPANY_ID]: priceOff.company_id || 1,
              [PRICEOFF.COLUMNS.CREATED_BY]: userDetails.id,
              [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
            });

          var offerId = query_insert[0].id;

          // Insert log entry
          await knex(PRICEOFF_LOGS.NAME).insert({
            [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
            [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: offerId,
            [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: priceOff,
            [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: priceOff.company_id || 1,
            [PRICEOFF_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
            [PRICEOFF_LOGS.COLUMNS.USER_ID]: userDetails.id,
          });
        }

        // --- Related tables ---
        const outletInserts =
          Array.isArray(priceOff.outlet) && priceOff.outlet.length > 0
            ? priceOff.outlet.map((outlet_id) => ({
              [PRICEOFF_OUTLET.COLUMNS.PRICEOFF_ID]: offerId,
              [PRICEOFF_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
              [PRICEOFF_OUTLET.COLUMNS.IS_ACTIVE]: true,
              [PRICEOFF_OUTLET.COLUMNS.COMPANY_ID]: priceOff.company_id || 1,
              [PRICEOFF_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
              [PRICEOFF_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
            }))
            : [];

        const partnerInserts =
          Array.isArray(priceOff.ppartner) && priceOff.ppartner.length > 0
            ? priceOff.ppartner.map((partner) => ({
              [PRICEOFF_PARTNER.COLUMNS.PRICEOFF_ID]: offerId,
              [PRICEOFF_PARTNER.COLUMNS.PPARTNER_ID]: partner,
              [PRICEOFF_PARTNER.COLUMNS.IS_ACTIVE]: true,
              [PRICEOFF_PARTNER.COLUMNS.COMPANY_ID]: priceOff.company_id || 1,
              [PRICEOFF_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
              [PRICEOFF_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
            }))
            : [];

        await Promise.all([
          outletInserts.length > 0 &&
          knex(PRICEOFF_OUTLET.NAME).insert(outletInserts),
          partnerInserts.length > 0 &&
          knex(PRICEOFF_PARTNER.NAME).insert(partnerInserts),
        ]);

        successfulInserts.push({ index: i, prod_code: priceOff.prod_code });
      } catch (err) {

        const errorMessage =
          err?._errors?.[0]?.message ||
          err?.message ||
          "Unknown error";
        failedInserts.push({
          index: i,
          reason: errorMessage,
          payload: priceOff,
        });
      }

    }

    // return {
    //   success: failedInserts.length === 0,
    //   insertedCount: successfulInserts.length,
    //   failedCount: failedInserts.length,
    //   failedInserts,
    // };
    return {
      success: true,
      failedInserts,
    };

  }

  async function putPriceOffExcel({ params, body, logTrace, userDetails }) {
    const knex = this;
    const successful = [];
    const failed = [];
    let rows = [];

    // ----------------- LOAD CSV -----------------
    try {
      const file = body.excelfile;
      let buffer;

      if (file.file && typeof file.toBuffer === "function") {
        buffer = await file.toBuffer();
      } else if (file._buf?.data) {
        buffer = Buffer.from(file._buf.data);
      } else {
        throw new Error("Unable to read uploaded CSV");
      }

      const csvText = buffer.toString("utf8");
      rows = parse(csvText, { columns: true, skip_empty_lines: true });

    } catch (err) {
      return { success: false, message: "CSV parsing failed", error: err.message };
    }

    const toInt = (v) => {
      if (v == null || v === "") return null;
      const n = Number(v);
      return Number.isInteger(n) ? n : Math.floor(n);
    };

    const BATCH_SIZE = 5000;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      let batch = rows.slice(i, i + BATCH_SIZE);

      // ----------------- FILTER ONLY UPDATED ROWS -----------------
      batch = batch.filter(r => Number(r["Is Updated"]) == 1);

      if (batch.length === 0) continue;

      // console.log('=======batch==========', batch.length)

      // ----------------- PID + CODE pairs -----------------
      const pidProdCodes = batch.map(r => [
        Number(r.PID),
        r.Code
      ]);

      // ----------------- FETCH MATCHING RECORDS -----------------
      const existingRows = await knex(PRICEOFF.NAME)
        .distinct([
          `${PRICEOFF.COLUMNS.PID}`,
          `${PRICEOFF.COLUMNS.PROD_CODE}`,
          `${PRICEOFF.COLUMNS.PACTIVE}`,
          `${PRICEOFF.COLUMNS.PFROM}`,
          `${PRICEOFF.COLUMNS.PTO}`,
          `${PRICEOFF.COLUMNS.AMOUNT}`,
          `${PRICEOFF.COLUMNS.PCOMPAMT}`,
          `${PRICEOFF.COLUMNS.PLOCAMT}`,
          `${PRICEOFF.COLUMNS.PMRP}`
        ])
        .where(PRICEOFF.COLUMNS.PTO, ">=", knex.raw("CURRENT_DATE"))
      // .whereIn([PRICEOFF.COLUMNS.PID, PRICEOFF.COLUMNS.PROD_CODE], pidProdCodes);


      // console.log('=======existingRows==========', existingRows.length)

      // ----------------- MAP FOR FAST LOOKUP -----------------
      const existingMap = new Map();
      existingRows.forEach(row => {
        existingMap.set(`${row.pid}_${row.prod_code}`, row);
      });

      const logRows = [];
      const updates = [];

      // ----------------- PROCESS CSV ROWS -----------------
      for (const r of batch) {
        const PID = Number(r.PID);
        const Code = r.Code;

        const newData = {
          PID,
          Code,
          PActive: toInt(r["P Active"]),
          Amount: Number(r.Amount),
          Company: Number(r.Company),
          MRP: Number(r.MRP),
          Outlet: Number(r.Outlet),
          FromDate: parseCSVDate(r["From Date"]),
          ToDate: parseCSVDate(r["To Date"])
        };

        const key = `${PID}_${Code}`;
        const oldRow = existingMap.get(key);

        if (!oldRow) {
          failed.push({ PID, Code, reason: "No matching active record found" });

          logRows.push({
            operation_name: "UPDATE-FAILED",
            priceoff_id: PID,
            old_data: null,
            changed_data: newData,
            company_id: 1,
            user_name: userDetails.user_name,
            user_id: userDetails.id,
          });
        } else {
          updates.push({ ...newData, oldRow });
        }
      }

      // ----------------- TRANSACTION -----------------
      await knex.transaction(async (trx) => {

        for (const u of updates) {
          await trx(PRICEOFF.NAME)
            .where(PRICEOFF.COLUMNS.PID, u.PID)
            .where(PRICEOFF.COLUMNS.PROD_CODE, u.Code)
            .update({
              [PRICEOFF.COLUMNS.PACTIVE]: u.PActive,
              [PRICEOFF.COLUMNS.PFROM]: u.FromDate,
              [PRICEOFF.COLUMNS.PTO]: u.ToDate,
              [PRICEOFF.COLUMNS.AMOUNT]: u.Amount,
              [PRICEOFF.COLUMNS.PCOMPAMT]: u.Company,
              [PRICEOFF.COLUMNS.PLOCAMT]: u.Outlet,
              [PRICEOFF.COLUMNS.PMRP]: u.MRP,
              [PRICEOFF.COLUMNS.UPDATED_BY]: userDetails.id,
              [PRICEOFF.COLUMNS.UPDATED_AT]: trx.fn.now()
            });

          logRows.push({
            operation_name: "UPDATE",
            priceoff_id: u.PID,
            old_data: u.oldRow,
            changed_data: {
              pactive: u.PActive,
              pfrom: u.FromDate,
              pto: u.ToDate,
              amount: u.Amount,
              pcompamt: u.Company,
              plocamt: u.Outlet,
              pmrp: u.MRP
            },
            company_id: 1,
            user_name: userDetails.user_name,
            user_id: userDetails.id,
          });

          successful.push({ pid: u.PID, prod_code: u.Code });
        }

        await insertPriceOffLogs(trx, logRows);
      });
    }

    return {
      success: true,
      updated_count: successful.length,
      failed_count: failed.length,
      failed,
    };
  }

  // ----------------- LOG INSERT -----------------
  async function insertPriceOffLogs(knex, logRows) {
    if (!logRows.length) return;

    const logs = logRows.map(log => ({
      [PRICEOFF_LOGS.COLUMNS.PRICEOFF_ID]: log.priceoff_id,
      [PRICEOFF_LOGS.COLUMNS.OLD_DATA]: log.old_data,
      [PRICEOFF_LOGS.COLUMNS.CHANGED_DATA]: log.changed_data,
      [PRICEOFF_LOGS.COLUMNS.OPERATION_NAME]: log.operation_name,
      [PRICEOFF_LOGS.COLUMNS.COMPANY_ID]: log.company_id,
      [PRICEOFF_LOGS.COLUMNS.USER_NAME]: log.user_name,
      [PRICEOFF_LOGS.COLUMNS.USER_ID]: log.user_id,
      [PRICEOFF_LOGS.COLUMNS.OPERATION_DATE]: knex.fn.now(),
    }));

    await knex.batchInsert(PRICEOFF_LOGS.NAME, logs, 2000);
  }

  function parseCSVDate(dateStr) {
    if (!dateStr) return null;

    dateStr = dateStr.toString().trim();

    // Handle DD-MM-YY or D-M-YY
    let parts;
    if (dateStr.includes("-")) {
      parts = dateStr.split("-");
      if (parts[2].length === 2) {
        // YY → YYYY (assume 2000s)
        parts[2] = '20' + parts[2];
      }
    } else if (dateStr.includes("/")) {
      parts = dateStr.split("/");
    } else {
      return null;
    }

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // JS month 0-indexed
    let year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;

    // Format to PostgreSQL timestamp without timezone
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = "00";
    const mi = "00";
    const ss = "00";

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  return {
    postOfferMaster,
    putOfferMaster,
    deleteOfferMaster,
    getOfferMasterInfo,
    getOfferMasterPaginate,
    postPriceOffExcel,
    putPriceOffExcel
  };
}

module.exports = OfferMasterRepo;
