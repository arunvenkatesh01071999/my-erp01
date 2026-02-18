const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OFFER_MASTER, OFFER_MASTER_OUTLET, OFFER_MASTER_PARTNER, OFFER_MASTER_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const excelImportRepo = require("../../../Excelupload/repository/excelmport");

function OfferMasterRepo(fastify) {
  async function getOfferMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search, from_date, to_date } = queryString;

    const query = knex
      .select([
        `${OFFER_MASTER.NAME}.*`,
        `${ITEM.NAME}.pro_name as buy_product_name`, // Buy product name
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as buy_pro_code`,
        `getItem.pro_name as get_product_name`, // Get product name
        `getItem.pro_code as get_pro_code` // Get product name
      ])
      .from(`${OFFER_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`
      )
      .leftJoin(
        `${ITEM.NAME} as getItem`,
        `getItem.${ITEM.COLUMNS.ID}`,
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`
      )
      .orderBy(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`, "DESC");


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(OFFER_MASTER.COLUMNS.ONAME, "ilike", `%${search}%`);
      });
    }

    if (!from_date == '') {
      query.whereRaw(
        `DATE(${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}) >= ?`, from_date
      )
    }
    if (!to_date == '') {
      query.whereRaw(
        `DATE(${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}) <= ?`, to_date
      )
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Offer Master",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Offer Master data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const responsewith_outletdetails = await Promise.all(
      response.data.map(async offers => {
        const outlets_lines = await knex
          .select([
            `${OUTLETS.NAME}.*`,
          ])
          .from(`${OFFER_MASTER_OUTLET.NAME} as ${OFFER_MASTER_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OID}`, offers.oid);

        return { ...offers, outlets_lines };
      })
    );


    return {
      data: responsewith_outletdetails,
      meta: response.meta
    };
  }
  async function postOfferMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    if (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) {
      const query = knex(OFFER_MASTER.NAME)
        .join(
          OFFER_MASTER_OUTLET.NAME,
          `${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OID}`,
          `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`
        )
        // .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Ogetid)
        .whereIn(`${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID}`, body.outlet_ids)
        .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`, true)
        .where(`${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.IS_ACTIVE}`, true)
        // ✅ Check Obuyid & Ogetid in both directions
        .andWhere((builder) => {
          builder
            .where((sub) => {
              sub
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, body.Obuyid)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Ogetid);
            })
            .orWhere((sub) => {
              sub
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, body.Ogetid)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Obuyid);
            });
        })
        .andWhere((builder) => {
          builder
            .whereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, [body.Pfrom, body.Pto])
            .orWhereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, [body.Pfrom, body.Pto])
            .orWhere((subquery) => {
              subquery
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, '<=', body.Pfrom)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, '>=', body.Pto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer Already Exists for this outlets and get products",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
    }
    if (Array.isArray(body.ppartner) && body.ppartner.length > 0) {
      const query = knex(OFFER_MASTER.NAME)
        .join(
          OFFER_MASTER_PARTNER.NAME,
          `${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.OID}`,
          `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`
        )
        // .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Ogetid)
        .whereIn(`${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.PPARTNER_ID}`, body.ppartner)
        .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`, true)
        .where(`${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.IS_ACTIVE}`, true)
        // ✅ Check Obuyid & Ogetid in both directions
        .andWhere((builder) => {
          builder
            .where((sub) => {
              sub
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, body.Obuyid)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Ogetid);
            })
            .orWhere((sub) => {
              sub
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, body.Ogetid)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, body.Obuyid);
            });
        })
        .andWhere((builder) => {
          builder
            .whereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, [body.Pfrom, body.Pto])
            .orWhereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, [body.Pfrom, body.Pto])
            .orWhere((subquery) => {
              subquery
                .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, '<=', body.Pfrom)
                .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, '>=', body.Pto);
            });
        });

      const exists_response = await query;

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Offer already exists for this partner and get products",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }

    }

    const query_insert = await knex(`${OFFER_MASTER.NAME}`)
      .returning(['oid']) // Fixed `retrning` typo
      .insert({
        [OFFER_MASTER.COLUMNS.OTYPE]: body.Otype,
        [OFFER_MASTER.COLUMNS.ONAME]: body.Oname,
        [OFFER_MASTER.COLUMNS.OBUY]: body.obuy,
        [OFFER_MASTER.COLUMNS.OGET]: body.oget,
        [OFFER_MASTER.COLUMNS.PFROM]: body.Pfrom,
        [OFFER_MASTER.COLUMNS.PTO]: body.Pto,
        [OFFER_MASTER.COLUMNS.ACTIVE]: true,
        [OFFER_MASTER.COLUMNS.OBUYID]: body.Obuyid,
        [OFFER_MASTER.COLUMNS.OGETID]: body.Ogetid,
        [OFFER_MASTER.COLUMNS.UID]: body.uid,
        [OFFER_MASTER.COLUMNS.DIS]: body.dis,
        [OFFER_MASTER.COLUMNS.POFF]: body.poff,
        [OFFER_MASTER.COLUMNS.OMODE]: body.omode,
        [OFFER_MASTER.COLUMNS.OUTLETID]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
        [OFFER_MASTER.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
        [OFFER_MASTER.COLUMNS.PCOMPAMT]: body.PCompAmt,
        [OFFER_MASTER.COLUMNS.PLOCAMT]: body.PLocAmt,
        [OFFER_MASTER.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [OFFER_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
        [OFFER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating offer master",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const offerId = query_insert[0].oid;

    // Insert into related tables if data is provided
    const outletInserts = (Array.isArray(body.outlet_ids) && body.outlet_ids.length > 0) ?
      body.outlet_ids.map(outlet_id => ({
        [OFFER_MASTER_OUTLET.COLUMNS.OID]: offerId,
        [OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
        [OFFER_MASTER_OUTLET.COLUMNS.IS_ACTIVE]: true,
        [OFFER_MASTER_OUTLET.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [OFFER_MASTER_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
        [OFFER_MASTER_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];

    const partnerInserts = (Array.isArray(body.ppartner) && body.ppartner.length > 0) ?
      body.ppartner.map(partner => ({
        [OFFER_MASTER_PARTNER.COLUMNS.OID]: offerId,
        [OFFER_MASTER_PARTNER.COLUMNS.PPARTNER_ID]: partner,
        [OFFER_MASTER_PARTNER.COLUMNS.IS_ACTIVE]: true,
        [OFFER_MASTER_PARTNER.COLUMNS.COMPANY_ID]: body.company_id || 1,
        [OFFER_MASTER_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
        [OFFER_MASTER_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
      })) : [];

    await Promise.all([
      outletInserts.length > 0 && knex(OFFER_MASTER_OUTLET.NAME).insert(outletInserts),
      partnerInserts.length > 0 && knex(OFFER_MASTER_PARTNER.NAME).insert(partnerInserts)
    ]);

    // Insert log entry
    await knex(OFFER_MASTER_LOGS.NAME).insert({
      [OFFER_MASTER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [OFFER_MASTER_LOGS.COLUMNS.OID]: offerId,
      [OFFER_MASTER_LOGS.COLUMNS.CHANGED_DATA]: body, //JsonB
      [OFFER_MASTER_LOGS.COLUMNS.COMPANY_ID]: body.company_id || 1,
      [OFFER_MASTER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OFFER_MASTER_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });

    return { success: true };
  }
  async function putOfferMaster({ oid, body, logTrace, userDetails }) {
    const knex = this;


    // Check if the offer exists
    const existingOffer = await knex(OFFER_MASTER.NAME)
      .where(OFFER_MASTER.COLUMNS.OID, oid)
      // .where(OFFER_MASTER.COLUMNS.ACTIVE, true)
      .first();

    if (!existingOffer) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Offer not found or inactive",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Prepare data for updating the main offer
    const offerUpdateData = {
      [OFFER_MASTER.COLUMNS.OTYPE]: body.Otype,
      [OFFER_MASTER.COLUMNS.ONAME]: body.Oname,
      [OFFER_MASTER.COLUMNS.OBUY]: body.obuy,
      [OFFER_MASTER.COLUMNS.OGET]: body.oget,
      [OFFER_MASTER.COLUMNS.PFROM]: body.Pfrom,
      [OFFER_MASTER.COLUMNS.PTO]: body.Pto,
      [OFFER_MASTER.COLUMNS.OBUYID]: body.Obuyid,
      [OFFER_MASTER.COLUMNS.OGETID]: body.Ogetid,
      [OFFER_MASTER.COLUMNS.UID]: body.uid,
      [OFFER_MASTER.COLUMNS.DIS]: body.dis,
      [OFFER_MASTER.COLUMNS.POFF]: body.poff,
      [OFFER_MASTER.COLUMNS.OMODE]: body.omode,
      [OFFER_MASTER.COLUMNS.OUTLETID]: Array.isArray(body.outlet_ids) ? body.outlet_ids.join(",") : null,
      [OFFER_MASTER.COLUMNS.PPARTNER]: Array.isArray(body.ppartner) ? body.ppartner.join(",") : null,
      [OFFER_MASTER.COLUMNS.PCOMPAMT]: body.PCompAmt,
      [OFFER_MASTER.COLUMNS.PLOCAMT]: body.PLocAmt,
      [OFFER_MASTER.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
      [OFFER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
      [OFFER_MASTER.COLUMNS.UPDATED_AT]: knex.fn.now(), // If using a timestamp
      [OFFER_MASTER.COLUMNS.ACTIVE]: body.Active, // If using a timestamp
    };

    // Begin transaction to ensure atomicity
    await knex.transaction(async trx => {
      // Update main offer
      await trx(OFFER_MASTER.NAME)
        .where(OFFER_MASTER.COLUMNS.OID, oid)
        .update(offerUpdateData);

      // Handle outlet updates
      if (Array.isArray(body.outlet_ids)) {
        await trx(OFFER_MASTER_OUTLET.NAME)
          .where(OFFER_MASTER_OUTLET.COLUMNS.OID, oid)
          .delete();

        const outletInserts = body.outlet_ids.map(outlet_id => ({
          [OFFER_MASTER_OUTLET.COLUMNS.OID]: oid,
          [OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
          [OFFER_MASTER_OUTLET.COLUMNS.IS_ACTIVE]: body.Active,
          [OFFER_MASTER_OUTLET.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
          [OFFER_MASTER_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
          [OFFER_MASTER_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
        }));

        if (outletInserts.length > 0) {
          await trx(OFFER_MASTER_OUTLET.NAME).insert(outletInserts);
        }
      }

      // Handle partner updates
      if (Array.isArray(body.ppartner)) {
        await trx(OFFER_MASTER_PARTNER.NAME)
          .where(OFFER_MASTER_PARTNER.COLUMNS.OID, oid)
          .delete();

        const partnerInserts = body.ppartner.map(partner => ({
          [OFFER_MASTER_PARTNER.COLUMNS.OID]: oid,
          [OFFER_MASTER_PARTNER.COLUMNS.PPARTNER_ID]: partner,
          [OFFER_MASTER_PARTNER.COLUMNS.IS_ACTIVE]: body.Active,
          [OFFER_MASTER_PARTNER.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
          [OFFER_MASTER_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
          [OFFER_MASTER_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
        }));

        if (partnerInserts.length > 0) {
          await trx(OFFER_MASTER_PARTNER.NAME).insert(partnerInserts);
        }
      }

      // Insert log entry for the update
      await trx(OFFER_MASTER_LOGS.NAME).insert({
        [OFFER_MASTER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [OFFER_MASTER_LOGS.COLUMNS.OID]: oid,
        [OFFER_MASTER_LOGS.COLUMNS.OLD_DATA]: existingOffer,
        [OFFER_MASTER_LOGS.COLUMNS.CHANGED_DATA]: body, // JsonB
        [OFFER_MASTER_LOGS.COLUMNS.COMPANY_ID]: body.company_id ?? 1,
        [OFFER_MASTER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [OFFER_MASTER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      });
    });
    return { success: true };
  }
  async function deleteOfferMaster({ oid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OFFER_MASTER.NAME).where(OFFER_MASTER.COLUMNS.OID, oid);

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

    const query_delete = knex(OFFER_MASTER.NAME)
      .where(OFFER_MASTER.COLUMNS.OID, oid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete OFFER_MASTER",
      logTrace
    });
    const response = await query_delete;
    const query_delete1 = knex(OFFER_MASTER_OUTLET.NAME)
      .where(OFFER_MASTER_OUTLET.COLUMNS.OID, oid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete1,
      context: "delete OFFER_MASTER_OUTLET",
      logTrace
    });
    const response1 = await query_delete1;
    const query_delete2 = knex(OFFER_MASTER_PARTNER.NAME)
      .where(OFFER_MASTER_PARTNER.COLUMNS.OID, oid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete2,
      context: "delete OFFER_MASTER_PARTNER",
      logTrace
    });
    const response2 = await query_delete2;


    // Insert log entry
    await knex(OFFER_MASTER_LOGS.NAME).insert({
      [OFFER_MASTER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [OFFER_MASTER_LOGS.COLUMNS.OID]: oid,
      [OFFER_MASTER_LOGS.COLUMNS.CHANGED_DATA]: exists_response[0], //JsonB 
      [OFFER_MASTER_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [OFFER_MASTER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OFFER_MASTER_LOGS.COLUMNS.USER_ID]: userDetails.id,
    });
    return { success: true };
  }
  async function getOfferMasterInfo({ queryString, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OFFER_MASTER.NAME}.*`,
        `${ITEM.NAME}.pro_name as buy_product_name`, // Buy product name
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as buy_pro_code`,
        `getItem.pro_name as get_product_name`, // Get product name
        `getItem.pro_code as get_pro_code` // Get product name
      ])
      .from(`${OFFER_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`,
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`
      )
      .leftJoin(
        `${ITEM.NAME} as getItem`,
        `getItem.${ITEM.COLUMNS.ID}`,
        `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`
      )
      .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`, params.oid);



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Offer Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Offer Master data not found",
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
          .from(`${OFFER_MASTER_OUTLET.NAME} as ${OFFER_MASTER_OUTLET.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OID}`, params.oid);

        return { ...offers, outlets_lines };
      })
    );


    return responsewith_outletdetails[0];
  }
  async function postOfferMasterExcel({ params, body, logTrace, userDetails }) {
    const knex = this;
    const failedInserts = [];

    const outletIds = body.outlet_ids

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

    let outletIdArray = parseIfArrayOrJSON(outletIds)

    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
    const { headers: excelColumns, data: excelData } = excelColumnData;

    const allowedColumns = [
      "OfferName",
      "BuyQty",
      "GetQty",
      "FromDate",
      "ToDate",
      "BuyCode",
      "GetCode",
      "Amount",
      "Percentage",
      "Company",
      "Outlet",
      "Active"
    ];

    const requiredColumns = [
      "OfferName",
      "BuyQty",
      "GetQty",
      "FromDate",
      "ToDate",
      "BuyCode",
      "GetCode",
      "Amount",
      "Percentage",
      "Company",
      "Outlet",
      "Active"
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

    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

    const cleanedExcelData = excelData.filter(row =>
      row &&
      Object.values(row).some(
        val => val !== undefined && val !== null && String(val).trim() !== ""
      )
    );
    cleanedExcelData.forEach((row, index) => {
      const rowNo = index + 1;

      // 🔹 Required columns check
      requiredColumns.forEach(column => {
        if (
          row[column] === undefined ||
          row[column] === null ||
          row[column] === ""
        ) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${rowNo}: ${column} cannot be empty`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }
      });

      // 🔹 String validation
      if (typeof row.OfferName !== "string") {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${rowNo}: OfferName must be a string`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // 🔹 Numeric fields validation
      [
        "BuyQty",
        "GetQty",
        "BuyCode",
        "GetCode",
        "Amount",
        "Percentage",
        "Company",
        "Outlet"
      ].forEach(field => {
        if (isNaN(row[field])) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Row ${rowNo}: ${field} must be a number`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }
      });

      // 🔹 Date format validation
      if (!dateRegex.test(row.FromDate) || !dateRegex.test(row.ToDate)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${rowNo}: Dates must be in MM/DD/YYYY format`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      const fromDate = new Date(row.FromDate);
      const toDate = new Date(row.ToDate);

      if (fromDate > toDate) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${rowNo}: FromDate must be before ToDate`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      if (!["yes", "no"].includes(String(row.Active).toLowerCase())) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Row ${rowNo}: Active must be 'yes' or 'no'`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }
    });


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

      const offer = {
        omode: body.omode.value,
        Otype: body.Otype.value,
        Oname: String(excelDataDetails?.OfferName) || "",
        obuy: Number(excelDataDetails?.BuyQty) || 1,
        oget: Number(excelDataDetails?.GetQty) || 1,
        Pfrom: pfrom || new Date(),
        Pto: pto || new Date(),
        Obuyid: String(excelDataDetails?.BuyCode) || "",
        Ogetid: String(excelDataDetails?.GetCode) || "",
        dis: Number(excelDataDetails?.Amount) || 0,
        poff: Number(excelDataDetails?.Percentage) || 0,
        PCompAmt: Number(excelDataDetails?.Company) || 0,
        PLocAmt: Number(excelDataDetails?.Outlet) || 0,
        Active: excelDataDetails?.Active || true,
        outlet_ids: outletIdArray || []
      }

      try {
        console.log(offer, "offer");

        if (offer.Obuyid) {
          const buyItem = await knex(ITEM.NAME)
            .select(ITEM.COLUMNS.ID)
            .where(ITEM.COLUMNS.PRODUCT_CODE, offer.Obuyid)
            .first();

          if (!buyItem) {
            throw new Error(`Invalid Obuyid: No item found with pro_code ${offer.Obuyid}`);
          }
          offer.Obuyid = buyItem[ITEM.COLUMNS.ID];
        }

        // --- Resolve Ogetid from ITEM (pro_code) ---
        if (offer.Ogetid) {
          const getItem = await knex(ITEM.NAME)
            .select(ITEM.COLUMNS.ID)
            .where(ITEM.COLUMNS.PRODUCT_CODE, offer.Ogetid)
            .first();

          if (!getItem) {
            throw new Error(`Invalid Ogetid: No item found with pro_code ${offer.Ogetid}`);
          }
          offer.Ogetid = getItem[ITEM.COLUMNS.ID];
        }
        // --- Check Outlet Conflicts ---
        if (Array.isArray(offer.outlet_ids) && offer.outlet_ids.length > 0) {
          const exists_response = await knex(OFFER_MASTER.NAME)
            .join(
              OFFER_MASTER_OUTLET.NAME,
              `${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OID}`,
              `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`
            )
            // .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Ogetid)
            .whereIn(
              `${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID}`,
              offer.outlet_ids
            )
            .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`, true)
            .where(`${OFFER_MASTER_OUTLET.NAME}.${OFFER_MASTER_OUTLET.COLUMNS.IS_ACTIVE}`, true)
            .andWhere((builder) => {
              builder
                .where((sub) => {
                  sub
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, offer.Obuyid)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Ogetid);
                })
                .orWhere((sub) => {
                  sub
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, offer.Ogetid)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Obuyid);
                });
            })
            .andWhere((builder) => {
              builder
                .whereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, [offer.Pfrom, offer.Pto])
                .orWhereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, [offer.Pfrom, offer.Pto])
                .orWhere((subquery) => {
                  subquery
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, "<=", offer.Pfrom)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, ">=", offer.Pto);
                });
            });

          if (exists_response.length > 0) {
            throw new Error("Offer already exists for these outlets and get products");
          }
        }

        // --- Check Partner Conflicts ---
        if (Array.isArray(offer.ppartner) && offer.ppartner.length > 0) {
          const exists_response = await knex(OFFER_MASTER.NAME)
            .join(
              OFFER_MASTER_PARTNER.NAME,
              `${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.OID}`,
              `${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OID}`
            )
            // .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Ogetid)
            .whereIn(
              `${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.PPARTNER_ID}`,
              offer.ppartner
            )
            .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.ACTIVE}`, true)
            .where(`${OFFER_MASTER_PARTNER.NAME}.${OFFER_MASTER_PARTNER.COLUMNS.IS_ACTIVE}`, true)
            .andWhere((builder) => {
              builder
                .where((sub) => {
                  sub
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, offer.Obuyid)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Ogetid);
                })
                .orWhere((sub) => {
                  sub
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OBUYID}`, offer.Ogetid)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.OGETID}`, offer.Obuyid);
                });
            })
            .andWhere((builder) => {
              builder
                .whereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, [offer.Pfrom, offer.Pto])
                .orWhereBetween(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, [offer.Pfrom, offer.Pto])
                .orWhere((subquery) => {
                  subquery
                    .where(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PFROM}`, "<=", offer.Pfrom)
                    .andWhere(`${OFFER_MASTER.NAME}.${OFFER_MASTER.COLUMNS.PTO}`, ">=", offer.Pto);
                });
            });

          if (exists_response.length > 0) {
            throw new Error("Offer already exists for these partners and get products");
          }
        }

        const offerIdResult = await knex(OFFER_MASTER.NAME)
          .max(`${OFFER_MASTER.COLUMNS.OID} as maxOid`)
          .first();

        const nextOid = (offerIdResult?.maxOid || 0) + 1;
        // --- Insert into OFFER_MASTER ---
        const query_insert = await knex(OFFER_MASTER.NAME)
          .insert({
            [OFFER_MASTER.COLUMNS.OID]: nextOid,
            [OFFER_MASTER.COLUMNS.OTYPE]: offer.Otype,
            [OFFER_MASTER.COLUMNS.ONAME]: offer.Oname,
            [OFFER_MASTER.COLUMNS.OBUY]: offer.obuy,
            [OFFER_MASTER.COLUMNS.OGET]: offer.oget,
            [OFFER_MASTER.COLUMNS.PFROM]: offer.Pfrom,
            [OFFER_MASTER.COLUMNS.PTO]: offer.Pto,
            [OFFER_MASTER.COLUMNS.ACTIVE]: true,
            [OFFER_MASTER.COLUMNS.OBUYID]: offer.Obuyid,
            [OFFER_MASTER.COLUMNS.OGETID]: offer.Ogetid,
            [OFFER_MASTER.COLUMNS.UID]: userDetails.id,
            [OFFER_MASTER.COLUMNS.DIS]: offer.dis,
            [OFFER_MASTER.COLUMNS.POFF]: offer.poff,
            [OFFER_MASTER.COLUMNS.OMODE]: offer.omode,
            [OFFER_MASTER.COLUMNS.OUTLETID]: Array.isArray(offer.outlet_ids) ? offer.outlet_ids.join(",") : null,
            [OFFER_MASTER.COLUMNS.PPARTNER]: Array.isArray(offer.ppartner) ? offer.ppartner.join(",") : null,
            [OFFER_MASTER.COLUMNS.PCOMPAMT]: offer.PCompAmt,
            [OFFER_MASTER.COLUMNS.PLOCAMT]: offer.PLocAmt,
            [OFFER_MASTER.COLUMNS.COMPANY_ID]: offer.company_id || 1,
            [OFFER_MASTER.COLUMNS.CREATED_BY]: userDetails.id,
            [OFFER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id,
          })
          .returning(["oid"]);

        console.log(query_insert, "query_insert>>>>>>>>>>>>.");


        if (!query_insert || query_insert.length == 0) {
          throw new Error("Failed to insert offer master");
        }

        const offerId = query_insert[0].oid;
        console.log(offerId, "offerId");


        // --- Insert Outlet Mapping ---
        if (Array.isArray(offer.outlet_ids) && offer.outlet_ids.length > 0) {
          const outletInserts = offer.outlet_ids.map((outlet_id) => ({
            [OFFER_MASTER_OUTLET.COLUMNS.OID]: offerId,
            [OFFER_MASTER_OUTLET.COLUMNS.OUTLET_ID]: outlet_id,
            [OFFER_MASTER_OUTLET.COLUMNS.IS_ACTIVE]: true,
            [OFFER_MASTER_OUTLET.COLUMNS.COMPANY_ID]: offer.company_id || 1,
            [OFFER_MASTER_OUTLET.COLUMNS.CREATED_BY]: userDetails.id,
            [OFFER_MASTER_OUTLET.COLUMNS.UPDATED_BY]: userDetails.id,
          }));
          await knex(OFFER_MASTER_OUTLET.NAME).insert(outletInserts);
        }

        // --- Insert Partner Mapping ---
        if (Array.isArray(offer.ppartner) && offer.ppartner.length > 0) {
          const partnerInserts = offer.ppartner.map((partner) => ({
            [OFFER_MASTER_PARTNER.COLUMNS.OID]: offerId,
            [OFFER_MASTER_PARTNER.COLUMNS.PPARTNER_ID]: partner,
            [OFFER_MASTER_PARTNER.COLUMNS.IS_ACTIVE]: true,
            [OFFER_MASTER_PARTNER.COLUMNS.COMPANY_ID]: offer.company_id || 1,
            [OFFER_MASTER_PARTNER.COLUMNS.CREATED_BY]: userDetails.id,
            [OFFER_MASTER_PARTNER.COLUMNS.UPDATED_BY]: userDetails.id,
          }));
          await knex(OFFER_MASTER_PARTNER.NAME).insert(partnerInserts);
        }

        // --- Insert Logs ---
        await knex(OFFER_MASTER_LOGS.NAME).insert({
          [OFFER_MASTER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
          [OFFER_MASTER_LOGS.COLUMNS.OID]: offerId,
          [OFFER_MASTER_LOGS.COLUMNS.CHANGED_DATA]: offer, // JsonB
          [OFFER_MASTER_LOGS.COLUMNS.COMPANY_ID]: offer.company_id || 1,
          [OFFER_MASTER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [OFFER_MASTER_LOGS.COLUMNS.USER_ID]: userDetails.id,
        });
      } catch (err) {
        // Collect failed insert with index and reason
        failedInserts.push({
          index: i,
          offer: offer,
          reason: err.message || "Unknown error",
        });
      }
    }

    return {
      success: true,
      failedInserts,
    };
  }



  return {
    postOfferMaster,
    putOfferMaster,
    deleteOfferMaster,
    getOfferMasterInfo,
    getOfferMasterPaginate,
    postOfferMasterExcel
  };
}

module.exports = OfferMasterRepo;
