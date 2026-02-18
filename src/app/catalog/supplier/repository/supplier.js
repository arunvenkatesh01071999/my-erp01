const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SUPPLIER, SUPPLIER_LOGS, VENDORS_MAPPING, COMPANY, SUPPLIER_ORDER_DAYS, SUPPLIER_DESPATCH_DAYS, PURCHASE_ORDER_MASTER, SUPPLIER_DOCUMENTS, SUPPLIER_OUTLET_MAPPING, SUPPLIER_WAREHOUSE_MAPPING, VENDORS_OUTLET_MAPPING, TYPEDESIGN, OUTLET_SUPPLIER_ORDERDAYS } = require("../commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants")
const { WAREHOUSE } = require("../../../catalog/warehouse/commons/constants")
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { ITEM } = require("../../item/commons/constants");
const moment = require("moment/moment");
const { OUTLET_PRODUCT_MAPPING } = require("../../commons");
const excelImportRepo = require("../../../Excelupload/repository/excelmport");
const { now } = require("lodash");
const { insertInBatches, updateInBatches } = require("../../item/transformer/itemTransformer");


function supplierRepo(fastify) {
  async function getSupplier({ logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .orderBy(SUPPLIER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getSupplierPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as bankacno`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as acname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as fssai`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as available_balance`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .orderBy(SUPPLIER.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 2) {
      query.where(function () {
        this.where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`, "ilike", `%${search}%`)
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const finalResponse = await Promise.all(
      response.data.map(async supplier => {
        const defaultDays = {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false
        };

        let order_days = await knex
          .select(
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SUNDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.MONDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.TUESDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.WEDNESDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.THURSDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.FRIDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SATURDAY}`
          )
          .from(`${SUPPLIER_ORDER_DAYS.NAME} as ${SUPPLIER_ORDER_DAYS.NAME}`)
          .where(
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const orderDaysObj = order_days[0] ?? defaultDays;

        let despatch_days = await knex
          .select(
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SUNDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.MONDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.TUESDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.WEDNESDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.THURSDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.FRIDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SATURDAY}`
          )
          .from(`${SUPPLIER_DESPATCH_DAYS.NAME} as ${SUPPLIER_DESPATCH_DAYS.NAME}`)
          .where(
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const dispatchDaysObj = despatch_days[0] ?? defaultDays;

        const outlets = await knex
          .select([
            `${OUTLETS.NAME}.*`
          ])
          .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const warehouse = await knex
          .select([
            `${WAREHOUSE.NAME}.*`
          ])
          .from(`${SUPPLIER_WAREHOUSE_MAPPING.NAME} as ${SUPPLIER_WAREHOUSE_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .where(
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const documents = await knex
          .select([
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.ID}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} as path_url`
          ])
          .from(`${SUPPLIER_DOCUMENTS.NAME} as ${SUPPLIER_DOCUMENTS.NAME}`)
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE}`,
            1
          );


        const cheque = await knex
          .select([
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.ID}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} as path_url`
          ])
          .from(`${SUPPLIER_DOCUMENTS.NAME} as ${SUPPLIER_DOCUMENTS.NAME}`)
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE}`,
            2
          );

        const gstStatusMap = {
          0: "Inactive",
          1: "Active",
          2: "Cancelled",
          3: "Unregistered"
        };

        const panStatusMap = {
          0: "Inoperative",
          1: "Operative"
        };

        return {
          ...supplier,
          pan_status: {
            id: supplier.pan_status,
            name: panStatusMap[supplier.pan_status] ?? null
          },
          gst_status: {
            id: supplier.gst_status,
            name: gstStatusMap[supplier.gst_status] ?? null
          },
          month_days: supplier.month_days == 0 ? '' : supplier.month_days,
          supplier_creation_date: new Date(supplier.created_at).toISOString().split("T")[0],
          order_days: orderDaysObj,
          despatch_days: dispatchDaysObj,
          outlets,
          warehouse,
          documents,
          cheque
        };
      })
    );
    return {
      data: finalResponse,
      meta: response.meta
    };
  }

  async function postSupplier({ params, body, logTrace, userDetails }) {
    const knex = this;

    const response = await knex.transaction(async (trx) => {
      try {
        const exists_response = await trx(SUPPLIER.NAME)
          .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, body.supplier_name);

        if (exists_response.length > 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: "Supplier Name Already Exists",
            property: "",
            code: "NOT_ACCEPTABLE"
          });
        }

        const exists_supplier_code = await trx(SUPPLIER.NAME)
          .select(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_CODE}`)
          .limit(1)
          .orderBy(SUPPLIER.COLUMNS.ID, "DESC");

        let supplier_code;

        if (exists_supplier_code.length === 0) {
          supplier_code = "B001";
        } else {
          // Get last supplier code like 'B0034'
          const lastCode = exists_supplier_code[0].supplier_code;

          // Extract the numeric part (e.g. 34)
          const numericPart = parseInt(lastCode.slice(1), 10);
          // Increment it
          const nextNumber = numericPart + 1;
          console.log(nextNumber, "nextNumber");
          // Add leading zeros (e.g. 35 → '0035')
          const nextCode = "B" + String(nextNumber).padStart(4, "0");


          supplier_code = nextCode;
        }

        console.log("Next Supplier Code:", supplier_code);

        const [supplierResponse] = await trx(SUPPLIER.NAME)
          .returning("id")
          .insert({
            [SUPPLIER.COLUMNS.SUPPLIER_NAME]: body.supplier_name,
            [SUPPLIER.COLUMNS.SHORTNAME]: body.short_name,
            [SUPPLIER.COLUMNS.SUPPLIER_CODE]: supplier_code,
            [SUPPLIER.COLUMNS.ADD1]: body.add1,
            [SUPPLIER.COLUMNS.ADD2]: body.add2,
            [SUPPLIER.COLUMNS.ADD3]: body.add3 || "",
            [SUPPLIER.COLUMNS.ADD4]: body.add4 || "",
            [SUPPLIER.COLUMNS.COMPANY_ID]: body.company_id,
            [SUPPLIER.COLUMNS.COUNTRY_ID]: body.country,
            [SUPPLIER.COLUMNS.STATE_ID]: body.state,
            [SUPPLIER.COLUMNS.CITY_ID]: body.city,
            [SUPPLIER.COLUMNS.PINCODE]: body.pincode,
            [SUPPLIER.COLUMNS.PHONE]: body.phone,
            [SUPPLIER.COLUMNS.MOBILE]: body.mobile,
            [SUPPLIER.COLUMNS.EMAIL]: body.email,
            [SUPPLIER.COLUMNS.WEBSITE]: body.website,
            [SUPPLIER.COLUMNS.GSTIN]: body.gstin,
            [SUPPLIER.COLUMNS.GST_TYPE]: body.gst_type,
            [SUPPLIER.COLUMNS.BANK_AC_NO]: body.bankacno,
            [SUPPLIER.COLUMNS.BANKNAME]: body.bankname,
            [SUPPLIER.COLUMNS.AC_NAME]: body.acname,
            [SUPPLIER.COLUMNS.IFSCCODE]: body.ifsccode,
            [SUPPLIER.COLUMNS.FSSAI]: body.fssai,
            [SUPPLIER.COLUMNS.FSSAI_EXPIRY]: body.fssai_expiry,
            [SUPPLIER.COLUMNS.OP_BAL]: body.op_bal,
            [SUPPLIER.COLUMNS.PURCHASE]: body.purchase,
            [SUPPLIER.COLUMNS.TRANSFER]: body.transfer,
            [SUPPLIER.COLUMNS.PRODUCT_TYPE]: body.product_type,
            [SUPPLIER.COLUMNS.PAYMENT_TERMS]: body.payment_terms,
            [SUPPLIER.COLUMNS.GST_STATUS]: body.gst_status,
            [SUPPLIER.COLUMNS.PAN_STATUS]: body.pan_status,
            [SUPPLIER.COLUMNS.IS_DSD]: body.is_dsd,
            [SUPPLIER.COLUMNS.PAN_NUMBER]: body.pan,
            [SUPPLIER.COLUMNS.MONTH_DAYS]: body?.month_days === "" ? 0 : Number(body?.month_days),
            [SUPPLIER.COLUMNS.MSME_APPLICABLE]: body?.msme_applicable,
            [SUPPLIER.COLUMNS.MSME_NUMBER]: Boolean(body?.msme_applicable) === true ? String(body?.msme_number) : "",
            [SUPPLIER.COLUMNS.MSME_DECLARATION]: Boolean(body?.msme_applicable) === false ? String(body?.msme_declaration) : "",
            [SUPPLIER.COLUMNS.CREDIT_DAYS]: body?.credit_days === "" ? 0 : Number(body?.credit_days),
            [SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE]: Number(body?.tot_margin_percentage) || 0,
            [SUPPLIER.COLUMNS.TOT_MARGIN_VALUE]: Number(body?.tot_margin_value) || 0,
            [SUPPLIER.COLUMNS.CONTACT_PERSON]: String(body?.contact_person) || "",
            [SUPPLIER.COLUMNS.DESIGNATION]: String(body?.designation) || "",
            [SUPPLIER.COLUMNS.ALTER_MOBILE_NO]: String(body?.alter_mobile_no),
            [SUPPLIER.COLUMNS.ALTER_EMAIL]: String(body?.alter_email),
            [SUPPLIER.COLUMNS.IS_ACTIVE]: false,
            [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER.COLUMNS.CREATED_AT]: new Date()
          });

        const supplier_id = supplierResponse.id;

        const { order_days, despatch_days, outlets, warehouse, documents, cheque } = body;

        await trx(SUPPLIER_ORDER_DAYS.NAME).insert({
          [SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_ORDER_DAYS.COLUMNS.SUNDAY]: order_days.sunday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.MONDAY]: order_days.monday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.TUESDAY]: order_days.tuesday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.WEDNESDAY]: order_days.wednesday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.THURSDAY]: order_days.thursday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.FRIDAY]: order_days.friday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.SATURDAY]: order_days.saturday,
          [SUPPLIER_ORDER_DAYS.COLUMNS.CREATED_AT]: new Date(),
          [SUPPLIER_ORDER_DAYS.COLUMNS.CREATED_BY]: userDetails.id
        });

        await trx(SUPPLIER_DESPATCH_DAYS.NAME).insert({
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.SUNDAY]: despatch_days.sunday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.MONDAY]: despatch_days.monday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.TUESDAY]: despatch_days.tuesday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.WEDNESDAY]: despatch_days.wednesday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.THURSDAY]: despatch_days.thursday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.FRIDAY]: despatch_days.friday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.SATURDAY]: despatch_days.saturday,
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.CREATED_AT]: new Date(),
          [SUPPLIER_DESPATCH_DAYS.COLUMNS.CREATED_BY]: userDetails.id
        });

        if (Array.isArray(outlets) && outlets.length > 0) {
          const outletsDetails = outlets.map(outlet => ({
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.WH_ID]: body.wh_id || 1,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id
          }));
          await trx(SUPPLIER_OUTLET_MAPPING.NAME).insert(outletsDetails);
        }

        if (Array.isArray(warehouse) && warehouse.length > 0) {
          const warehouseDetails = warehouse.map(w => ({
            [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: w.warehouse_id,
            [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: body.company_id || 1,
            [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id
          }));
          await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME).insert(warehouseDetails);
        }


        if (Array.isArray(documents) && documents.length > 0) {
          const documentsDetails = documents.map(doc => ({
            [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME]: doc.document_name,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL]: doc.path_url,
            [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: body.company_id || 1,
            [SUPPLIER_DOCUMENTS.COLUMNS.WH_ID]: body.wh_id || 1,
            [SUPPLIER_DOCUMENTS.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: userDetails.id,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 1,
          }));
          await trx(SUPPLIER_DOCUMENTS.NAME)
            .insert(documentsDetails)
            .onConflict([
              SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID,
              SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME,
              SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL,
              SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID,
              SUPPLIER_DOCUMENTS.COLUMNS.WH_ID
            ])
            .ignore();

        }

        if (Array.isArray(cheque) && cheque.length > 0) {
          const chequeDetails = cheque.map(doc => ({
            [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME]: doc.document_name,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL]: doc.path_url,
            [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: body.company_id || 1,
            [SUPPLIER_DOCUMENTS.COLUMNS.WH_ID]: body.wh_id || 1,
            [SUPPLIER_DOCUMENTS.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: userDetails.id,
            [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 2,
          }));
          await trx(SUPPLIER_DOCUMENTS.NAME)
            .insert(chequeDetails)
            .onConflict([
              SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID,
              SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME,
              SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL,
              SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID,
              SUPPLIER_DOCUMENTS.COLUMNS.WH_ID
            ])
            .ignore();
        }

        await trx(SUPPLIER_LOGS.NAME).insert({
          [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
          [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
          [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
          [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(body.supplier_name).trim()
        });

        return { success: true };
      } catch (error) {
        if (["404", "400", "406"].includes(error?.code)) {
          throw error;
        }
        console.log("Transcation Error", error)

        throw CustomError.create({
          httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Failed to create supplier.",
          property: "",
          code: "SUPPLIER_CREATION_FAILED"
        });
      }
    });

    return response;
  }

  async function putSupplier({ supplier_id, body, queryString, logTrace, userDetails }) {
    const knex = this;
    const { approval } = queryString;

    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(SUPPLIER.NAME)
    //   .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, body.supplier_name)
    //   .whereNot(SUPPLIER.COLUMNS.ID, supplier_id)
    //   .andWhere(SUPPLIER.COLUMNS.SUPPLIER_CODE, body.supplier_code);

    // const exists_response1 = await query1;
    // console.log(exists_response1, "response1")
    // console.log(approval, "APPROVAL")
    // if (exists_response1.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "Suppiler Name Already Exists",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }

    const updateData = {
      [SUPPLIER.COLUMNS.SUPPLIER_NAME]: body.supplier_name,
      // [SUPPLIER.COLUMNS.SUPPLIER_CODE]: body.supplier_code,
      [SUPPLIER.COLUMNS.SHORTNAME]: body.short_name,
      [SUPPLIER.COLUMNS.ADD1]: body.add1,
      [SUPPLIER.COLUMNS.ADD2]: body.add2,
      [SUPPLIER.COLUMNS.ADD3]: body.add3 || "",
      [SUPPLIER.COLUMNS.ADD4]: body.add4 || "",
      [SUPPLIER.COLUMNS.COMPANY_ID]: body.company_id,
      [SUPPLIER.COLUMNS.COUNTRY_ID]: body.country,
      [SUPPLIER.COLUMNS.STATE_ID]: body.state,
      [SUPPLIER.COLUMNS.CITY_ID]: body.city,
      [SUPPLIER.COLUMNS.PINCODE]: body.pincode,
      [SUPPLIER.COLUMNS.PHONE]: body.phone,
      [SUPPLIER.COLUMNS.MOBILE]: body.mobile,
      [SUPPLIER.COLUMNS.EMAIL]: body.email,
      [SUPPLIER.COLUMNS.WEBSITE]: body.website,
      [SUPPLIER.COLUMNS.GSTIN]: body.gstin,
      [SUPPLIER.COLUMNS.GST_TYPE]: body.gst_type,
      [SUPPLIER.COLUMNS.BANK_AC_NO]: body.bankacno,
      [SUPPLIER.COLUMNS.BANKNAME]: body.bankname,
      [SUPPLIER.COLUMNS.AC_NAME]: body.acname,
      [SUPPLIER.COLUMNS.IFSCCODE]: body.ifsccode,
      [SUPPLIER.COLUMNS.FSSAI]: body.fssai,
      [SUPPLIER.COLUMNS.FSSAI_EXPIRY]: body.fssai_expiry,
      [SUPPLIER.COLUMNS.PURCHASE]: body.purchase,
      [SUPPLIER.COLUMNS.TRANSFER]: body.transfer,
      [SUPPLIER.COLUMNS.PRODUCT_TYPE]: body.product_type,
      [SUPPLIER.COLUMNS.PAYMENT_TERMS]: body.payment_terms,
      [SUPPLIER.COLUMNS.GST_STATUS]: body.gst_status,
      [SUPPLIER.COLUMNS.PAN_STATUS]: body.pan_status,
      [SUPPLIER.COLUMNS.IS_DSD]: body.is_dsd,
      [SUPPLIER.COLUMNS.PAN_NUMBER]: body.pan,
      [SUPPLIER.COLUMNS.MONTH_DAYS]: body?.month_days === "" ? 0 : Number(body?.month_days),
      [SUPPLIER.COLUMNS.OP_BAL]: body?.op_bal === "" ? 0 : Number(body?.op_bal),
      [SUPPLIER.COLUMNS.MSME_APPLICABLE]: body?.msme_applicable,
      [SUPPLIER.COLUMNS.MSME_NUMBER]: Boolean(body?.msme_applicable) === true ? String(body?.msme_number) : "",
      [SUPPLIER.COLUMNS.MSME_DECLARATION]: Boolean(body?.msme_applicable) === false ? String(body?.msme_declaration) : "",
      [SUPPLIER.COLUMNS.CREDIT_DAYS]: body?.credit_days === "" ? 0 : Number(body?.credit_days),
      [SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE]: Number(body?.tot_margin_percentage) || 0,
      [SUPPLIER.COLUMNS.TOT_MARGIN_VALUE]: Number(body?.tot_margin_value) || 0,
      [SUPPLIER.COLUMNS.CONTACT_PERSON]: String(body?.contact_person) || "",
      [SUPPLIER.COLUMNS.DESIGNATION]: String(body?.designation) || "",
      [SUPPLIER.COLUMNS.ALTER_MOBILE_NO]: String(body?.alter_mobile_no) || "",
      [SUPPLIER.COLUMNS.ALTER_EMAIL]: String(body?.alter_email) || "",
      [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id,
      [SUPPLIER.COLUMNS.IS_ACTIVE]: body.is_active ? true : body.approval,
      [SUPPLIER.COLUMNS.APPROVAL]: body.is_active ? true : body.approval,
    };

    // Conditionally add approval fields
    // if (approval === true) {
    //   updateData[SUPPLIER.COLUMNS.IS_ACTIVE] = body.approval;
    //   updateData[SUPPLIER.COLUMNS.APPROVAL] = body.approval;
    // }

    // Perform update
    const query_update = await knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id)
      .update(updateData);

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating  supplier",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const { order_days, despatch_days, outlets, warehouse, documents, cheque } = body;

    await knex(`${SUPPLIER_ORDER_DAYS.NAME}`)
      .where(`${SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID}`, supplier_id)
      .update({
        [SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
        [SUPPLIER_ORDER_DAYS.COLUMNS.SUNDAY]: order_days.sunday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.MONDAY]: order_days.monday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.TUESDAY]: order_days.tuesday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.WEDNESDAY]: order_days.wednesday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.THURSDAY]: order_days.thursday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.FRIDAY]: order_days.friday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.SATURDAY]: order_days.saturday,
        [SUPPLIER_ORDER_DAYS.COLUMNS.CREATED_AT]: new Date(),
        [SUPPLIER_ORDER_DAYS.COLUMNS.CREATED_BY]: userDetails.id
      });

    await knex(`${SUPPLIER_DESPATCH_DAYS.NAME}`)
      .where(`${SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID}`, supplier_id)
      .update({
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.SUNDAY]: despatch_days.sunday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.MONDAY]: despatch_days.monday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.TUESDAY]: despatch_days.tuesday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.WEDNESDAY]: despatch_days.wednesday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.THURSDAY]: despatch_days.thursday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.FRIDAY]: despatch_days.friday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.SATURDAY]: despatch_days.saturday,
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.CREATED_AT]: new Date(),
        [SUPPLIER_DESPATCH_DAYS.COLUMNS.CREATED_BY]: userDetails.id
      });


    if (Array.isArray(outlets) && outlets.length > 0) {
      const company_id = body.company_id || 1;
      const wh_id = body.wh_id || 1;
      const current_time = new Date();

      // Step 1: Mark all as inactive for this supplier
      await knex(SUPPLIER_OUTLET_MAPPING.NAME)
        .where({
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id
        })
        .update({
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: false,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: current_time,
        });

      // Step 2: Prepare data for upsert
      const insertData = outlets.map(outlet => ({
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.WH_ID]: wh_id || 1,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.ACTION_FLAG]: false,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID]: body.country,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID]: body.state,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID]: body.city,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE]: body.pincode,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE]: body.phone,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE]: body.mobile,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL]: body.email,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN]: body.gstin,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_AT]: current_time,
      }));

      // Step 3: Bulk insert with conflict update
      await knex(SUPPLIER_OUTLET_MAPPING.NAME)
        .insert(insertData)
        .onConflict([
          SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
          SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
          SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID,
          SUPPLIER_OUTLET_MAPPING.COLUMNS.WH_ID,
        ])
        .merge({
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: current_time,
        });
    }

    if (Array.isArray(warehouse) && warehouse.length > 0) {
      const company_id = body.company_id || 1;
      const current_time = new Date();

      // Step 1: Mark all as inactive for this supplier
      await knex(SUPPLIER_WAREHOUSE_MAPPING.NAME)
        .where({
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id
        })
        .update({
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: false,
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: current_time,
        });

      // Step 2: Prepare data for upsert
      const insertData = warehouse.map(warehouse => ({
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouse.warehouse_id,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
        [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: current_time,
      }));

      // Step 3: Bulk insert with conflict update
      await knex(SUPPLIER_WAREHOUSE_MAPPING.NAME)
        .insert(insertData)
        .onConflict([
          SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID,
          SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID,
          SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID,
        ])
        .merge({
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true,
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: current_time,
        });
    }


    if (Array.isArray(documents) && documents.length > 0) {
      const company_id = body.company_id || 1;
      const wh_id = body.wh_id || 1;
      const current_time = new Date();
      const user_id = userDetails.id || 1;

      // Step 1: Mark all as inactive for this supplier
      await knex(SUPPLIER_DOCUMENTS.NAME)
        .where({
          [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: company_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 1,
        })
        .update({
          [SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE]: false,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: user_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
        });

      // Step 2: Prepare data for upsert
      for (const doc of documents) {
        const insertRow = {
          [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.WH_ID]: wh_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: company_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME]: doc.document_name,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL]: doc.path_url,
          [SUPPLIER_DOCUMENTS.COLUMNS.CREATED_BY]: user_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 1,
        };

        await knex(SUPPLIER_DOCUMENTS.NAME)
          .insert(insertRow)
          .onConflict([
            SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID,
            SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME,
            SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL,
            SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID,
            SUPPLIER_DOCUMENTS.COLUMNS.WH_ID
          ])
          .merge({
            [SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE]: true,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: user_id,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
          });
      }
    }

    if (Array.isArray(cheque) && cheque.length > 0) {
      const company_id = body.company_id || 1;
      const wh_id = body.wh_id || 1;
      const current_time = new Date();
      const user_id = userDetails.id || 1;

      // Step 1: Mark all as inactive for this supplier
      await knex(SUPPLIER_DOCUMENTS.NAME)
        .where({
          [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: company_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 2,
        })
        .update({
          [SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE]: false,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: user_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
        });

      // Step 2: Prepare data for upsert
      for (const doc of cheque) {
        const insertRow = {
          [SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.WH_ID]: wh_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID]: company_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME]: doc.document_name,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL]: doc.path_url,
          [SUPPLIER_DOCUMENTS.COLUMNS.CREATED_BY]: user_id,
          [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
          [SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE]: 2,
        };

        await knex(SUPPLIER_DOCUMENTS.NAME)
          .insert(insertRow)
          .onConflict([
            SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID,
            SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME,
            SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL,
            SUPPLIER_DOCUMENTS.COLUMNS.COMPANY_ID,
            SUPPLIER_DOCUMENTS.COLUMNS.WH_ID
          ])
          .merge({
            [SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE]: true,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_BY]: user_id,
            [SUPPLIER_DOCUMENTS.COLUMNS.UPDATED_AT]: current_time,
          });
      }
    }

    // Update log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(body.supplier_name).trim()
    });


    return { success: true };
  }

  async function deleteSupplier({ supplier_id, body, logTrace, userDetails }) {
    const knex = this;
    const existssupplierquery = knex(SUPPLIER.NAME).
      where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await existssupplierquery;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const validationquery = knex(PURCHASE_ORDER_MASTER.NAME).
      where(PURCHASE_ORDER_MASTER.COLUMNS.SUPPLIER_ID, supplier_id);

    const exists_response1 = await validationquery;
    console.log(exists_response1)
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Cannot delete supplier,Associated with a purchase.",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete supplier",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    await knex(SUPPLIER_ORDER_DAYS.NAME)
      .where(SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID, supplier_id)
      .del();

    await knex(SUPPLIER_DESPATCH_DAYS.NAME)
      .where(SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID, supplier_id)
      .del();

    await knex(SUPPLIER_OUTLET_MAPPING.NAME)
      .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, supplier_id)
      .del();

    await knex(SUPPLIER_WAREHOUSE_MAPPING.NAME)
      .where(SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID, supplier_id)
      .del();

    await knex(SUPPLIER_DOCUMENTS.NAME)
      .where(SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID, supplier_id)
      .del();

    // Delete log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(exists_response[0].supplier_name).trim()
    });

    return { success: true };
  }

  async function getSupplierInfo({ params, logTrace }) {
    const knex = this;
    // const query = knex(SUPPLIER.NAME).where(SUPPLIER.COLUMNS.ID, params.id);

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, params.supplier_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getSupplierByProducts({ body, params, logTrace }) {
    const knex = this;
    const { company_id } = params;
    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .innerJoin(
        `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
      )
      .innerJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1,

    }));

    return updatedSupplierDetails;
  }

  async function getSupplierApprovalRepo({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as bankacno`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as acname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as fssai`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as available_balance`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        false
      )
      .andWhere(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`,
        false
      )
      .orderBy(SUPPLIER.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 2) {
      query.where(function () {
        this.where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`, "ilike", `%${search}%`)
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const finalResponse = await Promise.all(
      response.data.map(async supplier => {
        const defaultDays = {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false
        };

        let order_days = await knex
          .select(
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SUNDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.MONDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.TUESDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.WEDNESDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.THURSDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.FRIDAY}`,
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SATURDAY}`
          )
          .from(`${SUPPLIER_ORDER_DAYS.NAME} as ${SUPPLIER_ORDER_DAYS.NAME}`)
          .where(
            `${SUPPLIER_ORDER_DAYS.NAME}.${SUPPLIER_ORDER_DAYS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const orderDaysObj = order_days[0] ?? defaultDays;

        let despatch_days = await knex
          .select(
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SUNDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.MONDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.TUESDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.WEDNESDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.THURSDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.FRIDAY}`,
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SATURDAY}`
          )
          .from(`${SUPPLIER_DESPATCH_DAYS.NAME} as ${SUPPLIER_DESPATCH_DAYS.NAME}`)
          .where(
            `${SUPPLIER_DESPATCH_DAYS.NAME}.${SUPPLIER_DESPATCH_DAYS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const dispatchDaysObj = despatch_days[0] ?? defaultDays;

        const outlets = await knex
          .select([
            `${OUTLETS.NAME}.*`
          ])
          .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const warehouse = await knex
          .select([
            `${WAREHOUSE.NAME}.*`
          ])
          .from(`${SUPPLIER_WAREHOUSE_MAPPING.NAME} as ${SUPPLIER_WAREHOUSE_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .where(
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_WAREHOUSE_MAPPING.NAME}.${SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          );

        const documents = await knex
          .select([
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.ID}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} as path_url`
          ])
          .from(`${SUPPLIER_DOCUMENTS.NAME} as ${SUPPLIER_DOCUMENTS.NAME}`)
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE}`,
            1
          );

        const cheque = await knex
          .select([
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.ID}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME}`,
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} as path_url`
          ])
          .from(`${SUPPLIER_DOCUMENTS.NAME} as ${SUPPLIER_DOCUMENTS.NAME}`)
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID}`,
            supplier.id
          )
          .where(
            `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_TYPE}`,
            2
          );


        return {
          ...supplier,
          month_days: supplier.month_days == 0 ? '' : supplier.month_days,
          order_days: orderDaysObj,
          despatch_days: dispatchDaysObj,
          outlets,
          warehouse,
          documents,
          cheque
        };
      })
    );
    return {
      data: finalResponse,
      meta: response.meta
    };
  }


  async function getOutletSupplierByProducts({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay)

    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`,
      ])
      .from(`${SUPPLIER.NAME}`)

      // Supplier–Outlet Mapping
      .innerJoin(
        SUPPLIER_OUTLET_MAPPING.NAME,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
      )

      // Supplier–Outlet Product Mapping (Important for product-based filtering)
      .innerJoin(
        OUTLET_PRODUCT_MAPPING.NAME,
        function () {
          this.on(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
          ).andOn(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
            `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
          );
        }
      )

      // Active Checks
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`, true)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, ">", 0)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)

      // Conditions
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

      // Day-based conditions (Enable if needed)
      // .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${currentDay}`, true)
      // .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)

      .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "asc");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1,
    }));

    return updatedSupplierDetails;
  }



  async function getOutletSupplierByDayProducts({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const currentDay = moment().format('dddd').toLowerCase();
    console.log("currentDay", currentDay)

    const query = knex
      .select([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      // supplier – outlet mapping
      .innerJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
      )
      // supplier – outlet product mapping
      .innerJoin(
        `${OUTLET_PRODUCT_MAPPING.NAME}`,
        function () {
          this.on(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
          )
            .andOn(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
              `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
            );
        }
      )
      // item join
      .innerJoin(
        `${ITEM.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
      )
      .innerJoin(
        `${OUTLETS.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
      )
      // ACTIVE CHECKS (IMPORTANT)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`, true)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)


      //Conditions
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`, company_id)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`, outlet_id)

      //Day Conditions
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${currentDay}`, true)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${currentDay}`, true)
      .groupBy([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GST_TYPE}`
      ])
      .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "asc");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: Number(detail.gst_type) === 2,
      igst: Number(detail.gst_type) === 1,
    }));

    return updatedSupplierDetails;
  }

  async function getSupplierByOutletRepo({ queryString, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as bankacno`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as acname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as fssai`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as available_balance`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.WAREHOUSE_TYPE}`,
        0
      )
      .orderBy(SUPPLIER.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getSuplierOutletMappingDetails({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as bankacno`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as acname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as fssai`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BALANCE} as available_balance`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
      .innerJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where({
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`]: company_id,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
        [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true
      })
      .orderBy(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`, "DESC");


    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier mapping not found for the given outlet",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getSuplierOutletMappingOrderDaysRepo({ body, params, logTrace, queryString }) {
    const knex = this;
    const { outlet_id, region_id, company_id, current_page, page_size } = params;
    const { search } = queryString;

    let query = knex(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .select([
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company`,
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY} THEN 1 ELSE 0 END) as sunday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY} THEN 1 ELSE 0 END) as monday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY} THEN 1 ELSE 0 END) as tuesday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY} THEN 1 ELSE 0 END) as wednesday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY} THEN 1 ELSE 0 END) as thursday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY} THEN 1 ELSE 0 END) as friday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY} THEN 1 ELSE 0 END) as saturday`)

        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY} THEN 1 ELSE 0 END), 0) as sunday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY} THEN 1 ELSE 0 END), 0) as monday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY} THEN 1 ELSE 0 END), 0) as tuesday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY} THEN 1 ELSE 0 END), 0) as wednesday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY} THEN 1 ELSE 0 END), 0) as thursday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY} THEN 1 ELSE 0 END), 0) as friday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY} THEN 1 ELSE 0 END), 0) as saturday`)


      ])
      // CORRECT JOIN (item table)
      .innerJoin(
        ITEM.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
      )

      // Join typedesign
      .innerJoin(
        TYPEDESIGN.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )

      // Join outlets (mandatory because you filter outlets.is_active)
      .innerJoin(
        OUTLETS.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )

      // Join supplier
      .leftJoin(
        SUPPLIER.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )

      .leftJoin(
        OUTLET_SUPPLIER_ORDERDAYS.NAME,
        function () {
          this.on(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
            '=',
            `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID}`
          )
            .andOn(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
              '=',
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID}`
            )
            .andOn(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
              '=',
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID}`
            );
        }
      )

      // WHERE conditions
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, '>', 0)
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);


    // REGION FILTER (region selected & outlet_id = -1)
    if (Number(region_id)) {

      // Get outlets under region
      let outletIdsQuery = knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      // If specific outlet also passed → restrict to that
      if (Number(outlet_id) !== -1) {
        outletIdsQuery.andWhere(OUTLETS.COLUMNS.ID, Number(outlet_id));
      }

      const outletIds = await outletIdsQuery;

      if (outletIds.length === 0) return [];

      // Apply in main query
      query.whereIn(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outletIds);
    }

    query.groupBy(
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`
    );

    if (search && search.length >= 2) {
      query.where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ilike", `%${search}%`);
    }


    query.orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Brand Company Wise Order Days",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No brand-wise supplier order days found.",
        code: "NOT_FOUND"
      });
    }

    const total = response.length;
    const total_pages = Math.ceil(total / page_size);

    if (current_page > total_pages) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const start = (current_page - 1) * page_size;
    const end = start + page_size;
    const paginatedData = response.slice(start, end);

    return {
      data: paginatedData,
      meta: {
        pagination: {
          total,
          page: current_page,
          page_size,
          total_pages
        }
      }
    };
  }

  // async function getSuplierOutletMappingOrderDaysRepo({ body, params, logTrace, queryString }) {
  //   const knex = this;
  //   const { company_id, outlet_id, current_page, page_size } = params;
  //   const { search } = queryString;

  //   const query = knex
  //     .distinct([

  //       `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
  //       `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY}`,
  //       `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY}`
  //     ])
  //     .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
  //     .leftJoin(
  //       `${ITEM.NAME} as ${ITEM.NAME}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
  //       `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE}`
  //     )
  //     .leftJoin(
  //       `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
  //       `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
  //       `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`
  //     )
  //     .leftJoin(
  //       `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
  //       function () {
  //         this.on(
  //           `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
  //           `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
  //         ).on(
  //           `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
  //           `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
  //         );
  //       }
  //     )
  //     .where({
  //       [`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id
  //     })
  //     .orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ASC");


  //   if (search && search.length >= 2) {
  //     query.where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ilike", `%${search}%`);
  //   }

  //   const fullData = await query;

  //   if (!fullData.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "Supplier mapping not found for the given outlet",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   const total = fullData.length;
  //   const page = Number(current_page);
  //   const pageSize = Number(page_size);

  //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

  //   if (page > totalPages) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_ACCEPTABLE,
  //       message: "Requested page is beyond the available data",
  //       code: "NOT_ACCEPTABLE"
  //     });
  //   }

  //   const start = (page - 1) * pageSize;
  //   const end = start + pageSize;

  //   const paginatedData = fullData.slice(start, end);

  //   return {
  //     data: paginatedData,
  //     meta: {
  //       pagination: {
  //         total,
  //         page,
  //         page_size: pageSize,
  //         total_pages: totalPages
  //       }
  //     }
  //   };
  // }

  async function updateSupplierOutletMapping({ body, params, logTrace, query, userDetails }) {

    const knex = this;
    const { company_id, outlet_id, supplier_id, brand_company_id } = params;
    const {
      sunday, monday, tuesday, wednesday,
      thursday, friday, saturday
    } = body;
    const current_time = new Date();

    const existingSupplierRows = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
      .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID)
      .where(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, supplier_id)
      .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
      .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id)
      .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID, brand_company_id)

    if (!existingSupplierRows.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No supplier found for this outlet and brand id",
        code: "NOT_FOUND"
      });
    }

    const updateData = {
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
      [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: current_time
    };

    const updated = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
      .where({
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
        [SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
      })
      .update(updateData);

    const existing = await knex(OUTLET_SUPPLIER_ORDERDAYS.NAME)
      .first(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID)
      .where({
        [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
        [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
        [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
        [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id
      });

    if (!existing) {
      await knex(OUTLET_SUPPLIER_ORDERDAYS.NAME)
        .insert({
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.IS_ACTIVE]: true,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_BY]: userDetails.id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_AT]: current_time,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: current_time,
        });
    } else {
      await knex(OUTLET_SUPPLIER_ORDERDAYS.NAME)
        .where({ [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID]: existing.id })
        .update({
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
          [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: current_time,
        });
    }


    if (updated === 0) {
      throw CustomError.create({
        httpCode: 404,
        message: "Mapping not found",
        code: "NOT_FOUND"
      });
    }

    return { success: true };


  }


  // async function updateSupplierOutletOrderdays({ body, params, logTrace, query, userDetails }) {

  //   const knex = this;
  //   const trx = await knex.transaction();

  //   try {
  //     const { company_id, outlet_id, brand_company_id, region_id } = params;
  //     const {
  //       sunday, monday, tuesday, wednesday,
  //       thursday, friday, saturday
  //     } = body;


  //     // ----------------------------------------------------
  //     // VALIDATION — region_id AND outlet_id REQUIRED
  //     // ----------------------------------------------------
  //     if (!Number(region_id) || !Number(outlet_id)) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "region_id and outlet_id are required",
  //         code: "INVALID_INPUT"
  //       });
  //     }

  //     // ----------------------------------------------------
  //     // REGION + OUTLET FILTER PREPARATION (GLOBAL)
  //     // ----------------------------------------------------
  //     let regionOutletIds = await trx(OUTLETS.NAME)
  //       .pluck(OUTLETS.COLUMNS.ID)
  //       .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

  //     if (Number(outlet_id) !== -1) {
  //       regionOutletIds = regionOutletIds.filter(id => id === Number(outlet_id));
  //     }

  //     if (!regionOutletIds.length) {
  //       await trx.rollback();
  //       return { updated: 0, message: "No outlets found for given region/outlet." };
  //     }

  //     const outletIdFilter = regionOutletIds;

  //     const items = await trx(ITEM.NAME)
  //       .select(ITEM.COLUMNS.ID)
  //       .where({
  //         [ITEM.COLUMNS.TYPEDESIGN_ID]: brand_company_id,
  //         [ITEM.COLUMNS.COMPANY_ID]: company_id,
  //         [ITEM.COLUMNS.IS_ACTIVE]: true
  //       });

  //     if (!items.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "No products found for this outlet and brand id",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     const itemIds = items.map(i => i[ITEM.COLUMNS.ID]);

  //     const supplierRows = await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //       .distinct(OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID)
  //       .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, itemIds)
  //       .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIdFilter)
  //       // .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //       .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //     if (!supplierRows.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "No suppliers found for this outlet and brand company id",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     const supplierIds = supplierRows
  //       .map(r => r[OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID])
  //       .filter(id => id && id !== 0);

  //     if (!supplierIds.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "No valid suppliers found for this outlet and brand company id",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     const existingSupplierRows = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //       .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID)
  //       .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, supplierIds)
  //       .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outletIdFilter)
  //       // .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //       .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //     const existingSupplierIds = existingSupplierRows.map(row => row.supplier_id);

  //     for (let supplier_id of existingSupplierIds) {

  //       const existing = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //         .first(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID)
  //         .where({
  //           [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //           [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //           [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
  //           [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id
  //         });

  //       if (!existing) {
  //         await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //           .insert({
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.IS_ACTIVE]: true,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_BY]: userDetails.id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_AT]: trx.fn.now(),
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //           });
  //       } else {
  //         await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //           .where({ [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID]: existing.id })
  //           .update({
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //           });
  //       }
  //     }

  //     await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //       .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, itemIds)
  //       .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIdFilter)
  //       // .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //       .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id)
  //       .update({
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY]: sunday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY]: monday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY]: thursday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY]: friday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY]: saturday,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //         [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //       });

  //     await trx.commit();

  //     return { success: true };

  //   } catch (error) {
  //     await trx.rollback();
  //     throw error;
  //   }
  // }

  async function updateSupplierOutletOrderdays({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();

    try {
      const { company_id, outlet_id, brand_company_id, region_id } = params;
      const {
        sunday, monday, tuesday, wednesday,
        thursday, friday, saturday
      } = body;

      // ----------------------------------------------------
      // VALIDATION
      // ----------------------------------------------------
      if (!Number(region_id) || !Number(outlet_id)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "region_id and outlet_id are required",
          code: "INVALID_INPUT"
        });
      }
      console.log(company_id, outlet_id, brand_company_id, region_id);

      // Validate weekday values (force boolean)
      const dayValues = {
        sunday: !!sunday,
        monday: !!monday,
        tuesday: !!tuesday,
        wednesday: !!wednesday,
        thursday: !!thursday,
        friday: !!friday,
        saturday: !!saturday
      };
      console.log('dayValues', dayValues);

      // ----------------------------------------------------
      // FETCH OUTLETS FOR REGION
      // ----------------------------------------------------
      let regionOutletIds = await trx(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      if (Number(outlet_id) !== -1) {
        regionOutletIds = regionOutletIds.filter(id => id === Number(outlet_id));
      }

      if (!regionOutletIds.length) {
        await trx.rollback();

        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "No outlets found for given region/outlet.",
          code: "NOT_FOUND"
        });
        // return { updated: 0, message: "No outlets found for given region/outlet." };
      }

      const outletIds = regionOutletIds;

      console.log('outletIds', outletIds);

      // ----------------------------------------------------
      // FETCH PRODUCTS
      // ----------------------------------------------------
      const items = await trx(ITEM.NAME)
        .pluck(ITEM.COLUMNS.OUTLET_PRODUCT_ID)
        .where({
          [ITEM.COLUMNS.TYPEDESIGN_ID]: brand_company_id,
          [ITEM.COLUMNS.COMPANY_ID]: company_id,
          [ITEM.COLUMNS.IS_ACTIVE]: true
        });

      if (!items.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "No products found for this outlet and brand id",
          code: "NOT_FOUND"
        });
      }

      const itemIds = items;

      console.log('itemIds', itemIds);
      // ----------------------------------------------------
      // FETCH SUPPLIERS (FIXED)
      // ----------------------------------------------------
      const supplierIds = await trx(OUTLET_PRODUCT_MAPPING.NAME)
        .distinct(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`)
        .innerJoin(
          SUPPLIER.NAME,
          `${SUPPLIER.NAME}.id`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
        )
        .where(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
          brand_company_id
        )
        .whereIn(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
          outletIds
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`,
          company_id
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
          ">",
          0
        )
        .whereNotNull(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
          true
        )
        .andWhere(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`,
          true
        )
        .andWhere(
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`,
          0
        )
        .pluck(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`);


      console.log('supplierIds', supplierIds)

      const filteredSupplierIds = (supplierIds || []).map(id => Number(id)).filter(id => id > 0);

      console.log('filteredSupplierIds', filteredSupplierIds);


      if (!filteredSupplierIds.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "No suppliers found for this outlet and brand company id",
          code: "NOT_FOUND"
        });
      }

      // ----------------------------------------------------
      // PRELOAD EXISTING OUTLET_SUPPLIER_ORDERDAYS
      // ----------------------------------------------------
      const existingRows = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
        .select("*")
        .whereIn(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID, filteredSupplierIds)
        .whereIn(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID, outletIds)
        .andWhere(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID, brand_company_id)
        .andWhere(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID, company_id);

      const existingMap = new Map();
      for (const row of existingRows) {
        existingMap.set(`${row.supplier_id}_${row.outlet_id}`, row);
      }

      // ----------------------------------------------------
      // INSERT/UPDATE ORDER DAYS FOR EACH SUPPLIER + OUTLET
      // ----------------------------------------------------
      for (const supId of filteredSupplierIds) {
        for (const outId of outletIds) {
          const key = `${supId}_${outId}`;
          const exists = existingMap.get(key);

          if (!exists) {
            await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
              .insert({
                supplier_id: supId,
                outlet_id: outId,
                brand_company_id,
                company_id,
                ...dayValues,
                is_active: true,
                created_by: userDetails.id,
                updated_by: userDetails.id,
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
              });
          } else {
            await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
              .where("id", exists.id)
              .update({
                ...dayValues,
                updated_by: userDetails.id,
                updated_at: trx.fn.now()
              });
          }
        }
      }

      // ----------------------------------------------------
      // UPDATE OUTLET_PRODUCT_MAPPING FOR ALL OUTLETS
      // ----------------------------------------------------
      await trx(OUTLET_PRODUCT_MAPPING.NAME)
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, itemIds)
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIds)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID, brand_company_id)
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, '>', 0)
        .update({
          ...dayValues,
          is_active: true,
          // brand_company_id,
          updated_by: userDetails.id,
          updated_at: trx.fn.now(),
        });

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }


  async function getSuplierDetailsExportRepo({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CONTACT_PERSON}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.DESIGNATION}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ALTER_MOBILE_NO}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL}`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ALTER_EMAIL}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER}`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PAN_NUMBER}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MSME_APPLICABLE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MSME_NUMBER}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL} as opening_balance`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CREDIT_DAYS}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.TOT_MARGIN_VALUE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE}`,
        knex.raw(`MAX(CASE WHEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME} = 'PAN Number' THEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} END) as pan_card_url`),
        knex.raw(`MAX(CASE WHEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME} = 'GSTIN Number' THEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} END) as gstin_url`),
        knex.raw(`MAX(CASE WHEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_NAME} = 'BANK Passbook' THEN ${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.DOCUMENT_URL} END) as bank_passbook_url`),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as stroe_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY} as sunday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY} as monday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY} as tuesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY} as wednesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY} as thursday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY} as friday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY} as saturday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CONTACT_PERSON}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO}`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .innerJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
      )
      .innerJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUPPLIER_DOCUMENTS.NAME} as ${SUPPLIER_DOCUMENTS.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_DOCUMENTS.NAME}.${SUPPLIER_DOCUMENTS.COLUMNS.SUPPLIER_ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where({
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`]: company_id,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
        [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true
      })
      .groupBy(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME}`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CONTACT_PERSON}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.DESIGNATION}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ALTER_MOBILE_NO}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL}`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ALTER_EMAIL}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER}`,
        // `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PAN_NUMBER}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MSME_APPLICABLE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MSME_NUMBER}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CREDIT_DAYS}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.TOT_MARGIN_VALUE}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.CONTACT_PERSON}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO}`
      )

    if (Number(outlet_id) === 0) {
      const outletIds = await knex(OUTLETS.NAME)
        .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
        .pluck('id'); // returns [1,2,3,...]

      query.whereIn(
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        outletIds
      );
    } else {
      query.where(
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        outlet_id
      );
    }

    query.orderBy(
      `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
      "ASC"
    );

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier mapping not found for the given outlet",
        code: "NOT_FOUND"
      });

    }

    return response;
  }

  // async function postExcelSupplierRepo({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { company_id, status } = params;
  //   const { uploadExcelData } = excelImportRepo(fastify);
  //   const excelColumnData = await uploadExcelData.call(knex, {
  //     body,
  //     params,
  //     logTrace
  //   });
  //   const excelColumns = excelColumnData.headers;
  //   const excelData = excelColumnData.data;
  //   const { outlet, warehouse } = body;

  //   const parseIfArrayOrJSON = (input) => {
  //     const value = input?.value ?? input;

  //     // Handle arrays directly
  //     if (Array.isArray(value)) return value;

  //     // If it's already a plain object, return it
  //     if (typeof value === 'object' && value !== null) return value;

  //     try {
  //       if (typeof value === "string") {
  //         if (value.trim() === '[object Object]') {
  //           console.warn("Received invalid stringified object. Please check data source.");
  //           return {};
  //         }

  //         // Try to fix unquoted keys
  //         const fixed = value.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  //         return JSON.parse(fixed);
  //       }

  //       return [];
  //     } catch (e) {
  //       console.error("Failed to parse input:", value);
  //       return [];
  //     }

  //   };

  //   const outletDetails = parseIfArrayOrJSON(outlet);
  //   const warehouseDetails = parseIfArrayOrJSON(warehouse);

  //   console.log(outletDetails, "outlet");
  //   console.log(warehouseDetails, "warehouse");
  //   console.log(excelData, "excelData");
  //   console.log(excelData, "columns");

  //   // get item query
  //   try {
  //     const errorMessages = [];

  //     // Step 1: Define required columns
  //     const requiredColumns = [
  //       "supplier_name",
  //       // "supplier_code",
  //       "add1",
  //       "add2",
  //       "pincode",
  //       "city_name",
  //       "state_name",
  //       "country_name",
  //       "mobile",
  //       "alter_mobile_no",
  //       "email",
  //       "alter_email",
  //       "gstin",
  //       "pan_number",
  //       "msme_applicable",
  //       "msme_number",
  //       // "opening_balance",
  //       // "balance",
  //       "credit_days",
  //       // "tot_margin_percentage",
  //       // "tot_margin_value",
  //       "ac_name",
  //       "bankname",
  //       "bank_ac_no",
  //       // "pan_card_url",
  //       // "gstin_url",
  //       // "bank_passbook_url",
  //       // "sunday",
  //       // "monday",
  //       // "tuesday",
  //       // "wednesday",
  //       // "thursday",
  //       // "friday",
  //       // "saturday"
  //     ];

  //     // Step 3: Check if any required column is missing
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         property: "",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 4: Extract uploaded product codes
  //     const uploadedCodes = excelData.map(p => String(p.supplier_code).trim());
  //     const uploadedSupplierNames = excelData.map(p => String(p.supplier_name).toLowerCase().trim());

  //     // Step 5: Get existing products from DB
  //     const dbProductsRaw = await knex(SUPPLIER.NAME)
  //       .select(SUPPLIER.COLUMNS.SUPPLIER_CODE, SUPPLIER.COLUMNS.SUPPLIER_NAME);

  //     const dbSupplierCodes = dbProductsRaw.map(p => p[SUPPLIER.COLUMNS.SUPPLIER_CODE]);
  //     const dbSupplierNames = dbProductsRaw.map(p => p[SUPPLIER.COLUMNS.SUPPLIER_NAME].toLowerCase());

  //     // Step 6: Validate product codes
  //     if (Number(status) === 2) {
  //       // Update → codes must exist
  //       let invalidCodes = uploadedCodes.filter(code => !dbSupplierCodes.includes(code));
  //       if (invalidCodes.length > 0) {
  //         errorMessages.push(`Supplier Code Does Not Exist: ${invalidCodes.join(', ')}`);
  //       }
  //     }

  //     // Step 8: Check product names
  //     if (Number(status) === 1) {
  //       // Insert → names must be unique
  //       const existingNames = uploadedSupplierNames.filter(name => dbSupplierNames.includes(name));
  //       if (existingNames.length > 0) {
  //         errorMessages.push(`Supplier Name Already Exists : ${existingNames.join(', ')}`);
  //       }
  //     }

  //     // Finally, if any errors collected, throw once
  //     if (errorMessages.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: errorMessages.join(" | "),  // Combine with separator
  //         code: "VALIDATION_ERRORS"
  //       });
  //     }

  //     // Step-9: Fetch existing country IDs based on city names (lowercase + trim)
  //     const cityNames = excelData.map(p => String(p.city_name).trim().toLowerCase());

  //     // Fetch existing brands from DB with case-insensitive check
  //     const existingCityRows = await trx(CITIES.NAME)
  //       .select(CITIES.COLUMNS.ID, CITIES.COLUMNS.NAME)
  //       .whereRaw(
  //         `LOWER(TRIM(??)) IN (${cityNames.map(() => '?').join(',')})`,
  //         [CITIES.COLUMNS.NAME, ...cityNames]
  //       );

  //     // Create map of existing brands
  //     const existingCityMap = new Map(
  //       existingCityRows.map(b => [
  //         String(b[CITIES.COLUMNS.NAME]).trim().toLowerCase(),
  //         b[CITIES.COLUMNS.ID]
  //       ])
  //     );

  //     //Find missing city names
  //     const missingCityNames = cityNames.filter(name => !existingCityMap.has(name));

  //     //Throw dynamic error if any brand is missing
  //     if (missingCityNames.length > 0) {
  //       errorMessages.push(`City(s) Not Found: ${missingCityNames.join(', ')}`);
  //     }

  //     // Step-10: Fetch existing state IDs based on state names (lowercase + trim)
  //     const stateNames = excelData.map(p => String(p.state_name).trim().toLowerCase());

  //     // Fetch existing state from DB with case-insensitive check
  //     const existingStatesRows = await trx(STATES.NAME)
  //       .select(STATES.COLUMNS.ID, STATES.COLUMNS.NAME)
  //       .whereRaw(
  //         `LOWER(TRIM(??)) IN (${stateNames.map(() => '?').join(',')})`,
  //         [STATES.COLUMNS.NAME, ...stateNames]
  //       );

  //     // Create map of existing brands
  //     const existingStateMap = new Map(
  //       existingStatesRows.map(b => [
  //         String(b[STATES.COLUMNS.NAME]).trim().toLowerCase(),
  //         b[STATES.COLUMNS.ID]
  //       ])
  //     );

  //     //Find missing state names
  //     const missingStateNames = stateNames.filter(name => !existingStateMap.has(name));

  //     //Throw dynamic error if any brand is missing
  //     if (missingStateNames.length > 0) {
  //       errorMessages.push(`State(s) Not Found: ${missingStateNames.join(', ')}`);
  //     }

  //     // Step-11: Fetch existing country IDs based on country names (lowercase + trim)
  //     const countryNames = excelData.map(p => String(p.country_name).trim().toLowerCase());

  //     // Fetch existing country from DB with case-insensitive check
  //     const existingCountrysRows = await trx(COUNTRIES.NAME)
  //       .select(COUNTRIES.COLUMNS.ID, COUNTRIES.COLUMNS.NAME)
  //       .whereRaw(
  //         `LOWER(TRIM(??)) IN (${countryNames.map(() => '?').join(',')})`,
  //         [COUNTRIES.COLUMNS.NAME, ...countryNames]
  //       );

  //     // Create map of existing brands
  //     const existingCountryMap = new Map(
  //       existingCountrysRows.map(b => [
  //         String(b[COUNTRIES.COLUMNS.NAME]).trim().toLowerCase(),
  //         b[COUNTRIES.COLUMNS.ID]
  //       ])
  //     );

  //     //Find missing country names
  //     const missingCountryNames = countryNames.filter(name => !existingCountryMap.has(name));

  //     //Throw dynamic error if any brand is missing
  //     if (missingCountryNames.length > 0) {
  //       errorMessages.push(`Country(s) Not Found: ${missingCountryNames.join(', ')}`);
  //     }

  //     // Finally, if any errors collected, throw once
  //     if (errorMessages.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: errorMessages.join(" | "),  // Combine with separator
  //         code: "VALIDATION_ERRORS"
  //       });
  //     }

  //     // Step 12: Get current max ID once (only if you need to assign IDs manually)
  //     const [{ max_id: maxIdRaw = 0 }] = await knex(SUPPLIER.NAME).max("id as max_id");
  //     let maxId = maxIdRaw;

  //     const [lastSupplier] = await knex(SUPPLIER.NAME)
  //       .select(SUPPLIER.COLUMNS.SUPPLIER_CODE)
  //       .orderBy(SUPPLIER.COLUMNS.ID, "DESC")
  //       .limit(1);

  //     const lastCode = lastSupplier?.supplier_code ?? "B0000";
  //     const numericPart = parseInt(lastCode.slice(1), 10);

  //     const suppliersToInsert = [];
  //     const outletMappings = [];
  //     const warehouseMappings = [];
  //     const seenSuppliers = new Set();

  //     for (const [index, supplier] of excelData.entries()) {
  //       // const {
  //       //   supplier_name,
  //       //   add1,
  //       //   add2,
  //       //   pincode,
  //       //   city_name,
  //       //   state_name,
  //       //   country_name,
  //       //   mobile,
  //       //   alter_mobile_no,
  //       //   email,
  //       //   alter_email,
  //       //   gstin,
  //       //   pan_number,
  //       //   msme_applicable,
  //       //   msme_number,
  //       //   msme_declaration,
  //       //   opening_balance = 0,
  //       //   balance = 0,
  //       //   credit_days,
  //       //   tot_margin_percentage = 0,
  //       //   tot_margin_value = 0,
  //       //   ac_name,
  //       //   bankname,
  //       //   bank_ac_no,
  //       //   ifsccode,
  //       //   payment_terms,
  //       //   gst_type,
  //       //   fssai_expiry,
  //       //   pan_status,
  //       //   gst_status,
  //       //   product_type,
  //       //   short_name,
  //       //   supplier_code,
  //       //   type,
  //       //   fssaino,
  //       //   month_days,
  //       //   designation,
  //       //   contact_person,
  //       //   sunday = false,
  //       //   monday = false,
  //       //   tuesday = false,
  //       //   wednesday = false,
  //       //   thursday = false,
  //       //   friday = false,
  //       //   saturday = false,
  //       // } = supplier;
  //       // const nameKey = supplier_name.trim().toLowerCase();
  //       // if (seenSuppliers.has(nameKey)) continue;
  //       // seenSuppliers.add(nameKey);

  //       // // Generate next supplier code
  //       // const nextNumber = numericPart + index + 1;
  //       // const supplier_new_code = "B" + String(nextNumber).padStart(4, "0");

  //       // console.log(`Processing supplier: ${supplier_new_code}`);
  //       // const existingCityId = existingCityMap.get(city_name.trim().toLowerCase());
  //       // const existingStateId = existingStateMap.get(state_name.trim().toLowerCase());
  //       // const existingCountryId = existingCountryMap.get(country_name.trim().toLowerCase());

  //       // const supplierDataObject = {
  //       //   [SUPPLIER.COLUMNS.SUPPLIER_NAME]: supplier_name,
  //       //   [SUPPLIER.COLUMNS.SHORTNAME]: supplier_name,
  //       //   [SUPPLIER.COLUMNS.SUPPLIER_CODE]: supplier_new_code,
  //       //   [SUPPLIER.COLUMNS.ADD1]: add1,
  //       //   [SUPPLIER.COLUMNS.ADD2]: add2,
  //       //   [SUPPLIER.COLUMNS.COMPANY_ID]: 1,
  //       //   [SUPPLIER.COLUMNS.COUNTRY_ID]: existingCountryId,
  //       //   [SUPPLIER.COLUMNS.STATE_ID]: existingStateId,
  //       //   [SUPPLIER.COLUMNS.CITY_ID]: existingCityId,
  //       //   [SUPPLIER.COLUMNS.PINCODE]: pincode,
  //       //   [SUPPLIER.COLUMNS.MOBILE]: mobile,
  //       //   [SUPPLIER.COLUMNS.EMAIL]: email,
  //       //   [SUPPLIER.COLUMNS.GSTIN]: gstin,
  //       //   [SUPPLIER.COLUMNS.GST_TYPE]: 2,
  //       //   [SUPPLIER.COLUMNS.BANK_AC_NO]: bank_ac_no,
  //       //   [SUPPLIER.COLUMNS.BANKNAME]: bankname,
  //       //   [SUPPLIER.COLUMNS.PAN_NUMBER]: pan_number,
  //       //   [SUPPLIER.COLUMNS.AC_NAME]: ac_name,
  //       //   [SUPPLIER.COLUMNS.IFSCCODE]: ifsccode,
  //       //   [SUPPLIER.COLUMNS.FSSAI]: fssaino,
  //       //   [SUPPLIER.COLUMNS.OP_BAL]: opening_balance,
  //       //   [SUPPLIER.COLUMNS.BALANCE]: balance,
  //       //   [SUPPLIER.COLUMNS.MONTH_DAYS]: Number(month_days) || 0,
  //       //   [SUPPLIER.COLUMNS.MSME_APPLICABLE]: msme_applicable,
  //       //   [SUPPLIER.COLUMNS.MSME_NUMBER]: msme_applicable ? String(msme_number) : "",
  //       //   [SUPPLIER.COLUMNS.MSME_DECLARATION]: !msme_applicable ? String(msme_declaration) : "",
  //       //   [SUPPLIER.COLUMNS.CREDIT_DAYS]: Number(credit_days) || 0,
  //       //   [SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE]: Number(tot_margin_percentage) || 0,
  //       //   [SUPPLIER.COLUMNS.TOT_MARGIN_VALUE]: Number(tot_margin_value) || 0,
  //       //   [SUPPLIER.COLUMNS.CONTACT_PERSON]: contact_person || "",
  //       //   [SUPPLIER.COLUMNS.DESIGNATION]: designation || "",
  //       //   [SUPPLIER.COLUMNS.ALTER_MOBILE_NO]: alter_mobile_no || '',
  //       //   [SUPPLIER.COLUMNS.ALTER_EMAIL]: alter_email || '',
  //       //   [SUPPLIER.COLUMNS.IS_ACTIVE]: false
  //       // };

  //       const {
  //         supplier_name,
  //         add1,
  //         add2,
  //         pincode,
  //         city_name,
  //         state_name,
  //         country_name,
  //         mobile,
  //         alter_mobile_no,
  //         email,
  //         alter_email,
  //         gstin,
  //         pan_number,
  //         msme_applicable,
  //         msme_number,
  //         msme_declaration,
  //         opening_balance = 0,
  //         balance = 0,
  //         credit_days,
  //         tot_margin_percentage = 0,
  //         tot_margin_value = 0,
  //         ac_name,
  //         bankname,
  //         bank_ac_no,
  //         ifsccode,
  //         payment_terms,
  //         gst_type,
  //         fssai_expiry,
  //         pan_status,
  //         gst_status,
  //         product_type,
  //         short_name,
  //         supplier_code,
  //         type,
  //         fssaino,
  //         month_days,
  //         designation,
  //         contact_person,
  //         sunday = false,
  //         monday = false,
  //         tuesday = false,
  //         wednesday = false,
  //         thursday = false,
  //         friday = false,
  //         saturday = false,
  //       } = supplier;

  //       const nameKey = supplier_name.trim().toLowerCase();
  //       if (seenSuppliers.has(nameKey)) continue;
  //       seenSuppliers.add(nameKey);

  //       let finalSupplierCode = supplier_code?.trim();

  //       if (finalSupplierCode) {
  //         const codeFormat = /^B\d{4}$/;
  //         if (!codeFormat.test(finalSupplierCode)) {
  //           throw CustomError.create({
  //             httpCode: StatusCodes.NOT_FOUND,
  //             message: `Invalid supplier code format '${finalSupplierCode}'. Must match pattern B0001`,
  //             code: "VALIDATION_ERRORS"
  //           });
  //         }

  //         const existingSupplier = await knex(SUPPLIER.NAME)
  //           .where(SUPPLIER.COLUMNS.SUPPLIER_CODE, finalSupplierCode)
  //           .first();

  //         if (existingSupplier) {
  //           throw CustomError.create({
  //             httpCode: StatusCodes.NOT_FOUND,
  //             message: `Supplier code '${finalSupplierCode}' already exists in database`,
  //             code: "NOT_FOUND"
  //           });
  //         }
  //       } else {
  //         const nextNumber = numericPart + index + 1;
  //         finalSupplierCode = "B" + String(nextNumber).padStart(4, "0");
  //         console.log(`Auto-generated supplier_code: ${finalSupplierCode}`);
  //       }

  //       const existingCityId = existingCityMap.get(city_name.trim().toLowerCase());
  //       const existingStateId = existingStateMap.get(state_name.trim().toLowerCase());
  //       const existingCountryId = existingCountryMap.get(country_name.trim().toLowerCase());

  //       const supplierDataObject = {
  //         [SUPPLIER.COLUMNS.SUPPLIER_NAME]: supplier_name,
  //         [SUPPLIER.COLUMNS.SHORTNAME]: short_name,
  //         [SUPPLIER.COLUMNS.SUPPLIER_CODE]: finalSupplierCode,
  //         [SUPPLIER.COLUMNS.ADD1]: add1,
  //         [SUPPLIER.COLUMNS.ADD2]: add2,
  //         [SUPPLIER.COLUMNS.COMPANY_ID]: 1,
  //         [SUPPLIER.COLUMNS.COUNTRY_ID]: existingCountryId,
  //         [SUPPLIER.COLUMNS.STATE_ID]: existingStateId,
  //         [SUPPLIER.COLUMNS.CITY_ID]: existingCityId,
  //         [SUPPLIER.COLUMNS.PINCODE]: pincode,
  //         [SUPPLIER.COLUMNS.MOBILE]: mobile,
  //         [SUPPLIER.COLUMNS.EMAIL]: email,
  //         [SUPPLIER.COLUMNS.GSTIN]: gstin,
  //         [SUPPLIER.COLUMNS.GST_TYPE]: 2,
  //         [SUPPLIER.COLUMNS.BANK_AC_NO]: bank_ac_no,
  //         [SUPPLIER.COLUMNS.BANKNAME]: bankname,
  //         [SUPPLIER.COLUMNS.PAN_NUMBER]: pan_number,
  //         [SUPPLIER.COLUMNS.AC_NAME]: ac_name,
  //         [SUPPLIER.COLUMNS.IFSCCODE]: ifsccode,
  //         [SUPPLIER.COLUMNS.FSSAI]: fssaino,
  //         [SUPPLIER.COLUMNS.OP_BAL]: opening_balance,
  //         [SUPPLIER.COLUMNS.BALANCE]: balance,
  //         [SUPPLIER.COLUMNS.MONTH_DAYS]: Number(month_days) || 0,
  //         [SUPPLIER.COLUMNS.MSME_APPLICABLE]: msme_applicable,
  //         [SUPPLIER.COLUMNS.MSME_NUMBER]: msme_applicable ? String(msme_number) : "",
  //         [SUPPLIER.COLUMNS.MSME_DECLARATION]: !msme_applicable ? String(msme_declaration) : "",
  //         [SUPPLIER.COLUMNS.CREDIT_DAYS]: Number(credit_days) || 0,
  //         [SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE]: Number(tot_margin_percentage) || 0,
  //         [SUPPLIER.COLUMNS.TOT_MARGIN_VALUE]: Number(tot_margin_value) || 0,
  //         [SUPPLIER.COLUMNS.CONTACT_PERSON]: contact_person || "",
  //         [SUPPLIER.COLUMNS.DESIGNATION]: designation || "",
  //         [SUPPLIER.COLUMNS.ALTER_MOBILE_NO]: alter_mobile_no || '',
  //         [SUPPLIER.COLUMNS.ALTER_EMAIL]: alter_email || '',
  //         [SUPPLIER.COLUMNS.IS_ACTIVE]: false,
  //         [SUPPLIER.COLUMNS.PAYMENT_TERMS]: payment_terms,
  //         [SUPPLIER.COLUMNS.GST_TYPE]: gst_type,
  //         [SUPPLIER.COLUMNS.FSSAI_EXPIRY]: fssai_expiry,
  //         [SUPPLIER.COLUMNS.PAN_STATUS]: pan_status,
  //         [SUPPLIER.COLUMNS.GST_STATUS]: gst_status,
  //         [SUPPLIER.COLUMNS.PRODUCT_TYPE]: product_type,
  //         [SUPPLIER.COLUMNS.TYPE]: type,
  //         [SUPPLIER.COLUMNS.IS_ACTIVE]: false
  //       };

  //       switch (Number(status)) {
  //         case 1: {
  //           console.log("insert");

  //           // ✅ Generate new supplier ID
  //           const supplier_id = ++maxId;
  //           const currentDate = new Date();

  //           // ✅ Push supplier details for later batch insert
  //           suppliersToInsert.push({
  //             ...supplierDataObject,
  //             [SUPPLIER.COLUMNS.ID]: supplier_id,
  //             [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
  //             [SUPPLIER.COLUMNS.CREATED_AT]: currentDate
  //           });

  //           console.log("supplier details", suppliersToInsert);
  //           console.log("outlet_details", outletDetails);

  //           // ✅ Outlet Mapping Logic
  //           if (Array.isArray(outletDetails) && outletDetails.length > 0) {
  //             // Step 1: Mark old outlet mappings inactive
  //             await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //               .where({
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: finalSupplierCode,
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
  //               })
  //               .update({
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: false,
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //                 [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //               });

  //             // Step 2: Fetch all active outlets if "All Outlets" selected
  //             const isAllOutletSelected = outletDetails.some(o => Number(o.outlet_id) === 0);
  //             const allOutlets = isAllOutletSelected
  //               ? await trx(OUTLETS.NAME)
  //                 .select(OUTLETS.COLUMNS.ID)
  //                 .where(OUTLETS.COLUMNS.IS_ACTIVE, true)
  //               : [];

  //             // Step 3: Build mapping records
  //             for (const outlet of outletDetails) {
  //               const targetOutletIds =
  //                 Number(outlet.outlet_id) === 0
  //                   ? allOutlets.map(o => o.id)
  //                   : [outlet.outlet_id];

  //               for (const outletId of targetOutletIds) {
  //                 outletMappings.push({
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outletId,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: finalSupplierCode,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id || 1,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1]: add1,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2]: add2,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID]: existingCountryId || 101,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID]: existingStateId || 35,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID]: existingCityId,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE]: mobile,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL]: email,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL]: alter_email,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: balance,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL]: 0,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME]: bankname,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO]: bank_ac_no,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME]: ac_name,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE]: ifsccode,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN]: gstin,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO]: fssaino,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER]: pan_number,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id || 1,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.WH_ID]: 1,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_AT]: currentDate,
  //                   [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
  //                 });
  //               }
  //             }
  //           }

  //           // ✅ Warehouse Mapping Logic
  //           if (Array.isArray(warehouseDetails) && warehouseDetails.length > 0) {
  //             console.log("warehouse");

  //             // Step 1: Mark old warehouse mappings inactive
  //             await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME)
  //               .where({
  //                 [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //                 [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
  //               })
  //               .update({
  //                 [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: false,
  //                 [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //                 [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //               });

  //             // Step 2: Get sequence for next IDs
  //             const result = await trx.raw(`SELECT nextval('supplier_warehouse_mapping_id_seq')`);
  //             let nextId = Number(result.rows?.[0]?.nextval || 1);

  //             // Step 3: If "All Warehouses" selected, fetch active warehouses
  //             const needsAllWarehouses = warehouseDetails.some(w => Number(w.warehouse_id) === 0);
  //             const allWarehouses = needsAllWarehouses
  //               ? await trx(WAREHOUSE.NAME)
  //                 .select(WAREHOUSE.COLUMNS.ID)
  //                 .where(WAREHOUSE.COLUMNS.IS_ACTIVE, true)
  //               : [];

  //             // Step 4: Build warehouse mapping rows
  //             for (const wh of warehouseDetails) {
  //               const targetWarehouseIds =
  //                 Number(wh.warehouse_id) === 0
  //                   ? allWarehouses.map(w => w.id)
  //                   : [wh.warehouse_id];

  //               for (const warehouseId of targetWarehouseIds) {
  //                 warehouseMappings.push({
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.ID]: nextId++,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouseId,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.CREATED_AT]: currentDate,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //                   [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true,
  //                 });
  //               }
  //             }
  //           }

  //           break;
  //         }

  //         default:
  //           throw CustomError.create({
  //             httpCode: StatusCodes.BAD_REQUEST,
  //             message: `Invalid Status Type`,
  //             property: "Status Type",
  //             code: "INVALID_STATUS_TYPE",
  //           });
  //       }
  //     }

  //     await insertInBatches(
  //       trx,
  //       SUPPLIER.NAME,
  //       suppliersToInsert,
  //       SUPPLIER.COLUMNS.SUPPLIER_CODE, // <-- use only supplier_code
  //       {
  //         [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id,
  //         [SUPPLIER.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //         [SUPPLIER.COLUMNS.IS_ACTIVE]: true
  //       }
  //     );


  //     await insertInBatches(trx, SUPPLIER_OUTLET_MAPPING.NAME, outletMappings,
  //       [
  //         SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
  //         SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE,
  //         SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
  //         SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID
  //       ],
  //       {
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
  //       }
  //     );

  //     await insertInBatches(trx, SUPPLIER_WAREHOUSE_MAPPING.NAME, warehouseMappings,
  //       [
  //         SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID,
  //         SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID,
  //         SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID
  //       ],
  //       {
  //         [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //         [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //         [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true
  //       }
  //     );

  //     // await updateInBatches(
  //     //   trx,
  //     //   ITEM.NAME,
  //     //   productsToUpdate,     // [{id: 1, name: "Pen"}, {id: 2, name: "Book"}]
  //     //   [ITEM.COLUMNS.ID],    // ['id']
  //     //   {
  //     //     [ITEM.COLUMNS.UPDATED_BY]: userDetails.id,
  //     //     [ITEM.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //     //     [ITEM.COLUMNS.IS_ACTIVE]: true,
  //     //   }
  //     // );


  //     await trx.commit();
  //     console.log("Transaction completed successfully!");
  //     return { "success": true }

  //   } catch (error) {
  //     // Rollback transaction in case of any failure
  //     await trx.rollback();
  //     console.error("Transaction Failed:", error);

  //     if (error._code == 404 || error._code == 400) {
  //       throw error;
  //     }

  //     // Default to internal server error if it's not a known custom error
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Supplier excel import failed.",
  //       property: "",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });

  //   }
  // }

  async function postSupplierExcelValidation({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { company_id, status } = params;
    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, {
      body,
      params,
      logTrace
    });
    const excelColumns = excelColumnData.headers;
    const excelData = excelColumnData.data;

    // get item query
    try {
      const errorSupplierNames = [];
      const errorCountryNames = [];
      const errorCityNames = [];
      const errorStatesNames = [];


      // Step 1: Define required columns
      const requiredColumns = [
        "supplier_name",
        "add1",
        "add2",
        "pincode",
        "city_name",
        "state_name",
        "country_name",
        "mobile",
        "alter_mobile_no",
        "email",
        "alter_email",
        "gstin",
        "pan_number",
        "msme_applicable",
        "msme_number",
        "credit_days",
        "ac_name",
        "bankname",
        "bank_ac_no",
        "region_id",
        "warehouse_type"
      ];
      console.log("excelColumns", excelColumns)
      // Step 2: Check if any required column is missing
      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 4: Fetch DB Supplier Records
      const dbSupplierRaw = await knex(SUPPLIER.NAME)
        .select([
          SUPPLIER.COLUMNS.SUPPLIER_CODE,
          SUPPLIER.COLUMNS.SUPPLIER_NAME,
          SUPPLIER.COLUMNS.REGION_ID,
          SUPPLIER.COLUMNS.COMPANY_ID
        ]);

      // DB mapped array
      const dbSupplierMap = dbSupplierRaw.map(p => ({
        name: String(p[SUPPLIER.COLUMNS.SUPPLIER_NAME]).trim().toLowerCase(),
        region: Number(p[SUPPLIER.COLUMNS.REGION_ID]),
        company: Number(p[SUPPLIER.COLUMNS.COMPANY_ID]),
        code: String(p[SUPPLIER.COLUMNS.SUPPLIER_CODE]).trim()
      }));


      /*------------------------------------------------------------------*
         UPDATE MODE (status = 2)
         supplier_name + region_id + company_id must exist
      *------------------------------------------------------------------*/
      if (Number(status) === 2) {
        const invalidRows = excelData.filter(row => {
          const name = String(row.supplier_name).trim().toLowerCase();
          const region = Number(row.region_id);
          const company = Number(company_id);

          return !dbSupplierMap.some(db =>
            db.name === name &&
            db.region === region &&
            db.company === company
          );
        });

        if (invalidRows.length > 0) {
          const msg = invalidRows.map(r =>
            `${r.supplier_name} (Region: ${r.region_id}, Company: ${company_id})`
          );
          errorSupplierNames.push(
            `Supplier Does Not Exist For Update: ${msg.join(", ")}`
          );
        }
      }


      /*------------------------------------------------------------------*
         INSERT MODE (status = 1)
         supplier_name + region_id + company_id  must be unique
      *------------------------------------------------------------------*/
      if (Number(status) === 1) {
        const duplicates = excelData.filter(row => {
          const name = String(row.supplier_name).trim().toLowerCase();
          const region = Number(row.region_id);
          const company = Number(company_id);

          return dbSupplierMap.some(db =>
            db.name === name &&
            db.region === region &&
            db.company === company
          );
        });

        if (duplicates.length > 0) {
          const msg = duplicates.map(r =>
            `${r.supplier_name} (Region: ${r.region_id}, Company: ${company_id})`
          );
          errorSupplierNames.push(
            `Supplier Already Exists: ${msg.join(", ")}`
          );
        }
      }

      console.log("errorSupplierNames", errorSupplierNames)

      // Helper → Fetch categories in safe chunks
      async function fetchInChunks(trx, table, column, values, chunkSize = 300) {
        const result = [];

        for (let i = 0; i < values.length; i += chunkSize) {
          const chunk = values.slice(i, i + chunkSize);

          const placeholders = chunk.map(() => '?').join(',');

          const rows = await trx(table)
            .select("id", column)
            .whereRaw(`LOWER(TRIM(${column})) IN (${placeholders})`, chunk);

          result.push(...rows);
        }

        return result;
      }


      // ✅ Helper to safely return string
      const safeString = (val) => (typeof val === "string" ? val : (val != null ? String(val) : ""));

      // ----------------------------------------
      // COUNTRY CHECK (Optimized)
      // ----------------------------------------
      const countryNames = [...new Set(
        excelData.map(p => safeString(p.country_name).trim().toLowerCase()).filter(Boolean)
      )];

      const existingCountries = await fetchInChunks(
        knex,
        COUNTRIES.NAME,
        COUNTRIES.COLUMNS.NAME,
        countryNames
      );

      const countryMap = new Map(
        existingCountries.map(c => [
          safeString(c.name).trim().toLowerCase(),
          c.id
        ])
      );

      // find missing countries
      const missingCountries = countryNames.filter(n => !countryMap.has(n));
      const missingCountryList = [...missingCountries]; // store raw list

      if (missingCountries.length > 0) {
        errorCountryNames.push(`Countries Not Found: ${missingCountries.join(", ")}`);
      }


      // ----------------------------------------
      // STATE CHECK
      // ----------------------------------------
      const excelStateNames = [...new Set(
        excelData.map(r => safeString(r.state_name).trim().toLowerCase()).filter(Boolean)
      )];

      const dbStateNames = new Set(
        (await knex(STATES.NAME).select("name"))
          .map(r => safeString(r.name).trim().toLowerCase())
      );

      // Missing states (name only)
      const missingStateNames = excelStateNames.filter(name => !dbStateNames.has(name));

      if (missingStateNames.length > 0) {
        errorStatesNames.push(...missingStateNames);
      }

      const errorStateMapping = [];

      const stateNameMap = new Map(
        (await knex(STATES.NAME).select("id", "name", "country_id")).map(s => [
          `${safeString(s.name).trim().toLowerCase()}|${s.country_id}`,
          s.id
        ])
      );

      const stateMappingKeys = [...new Set(
        excelData.map(row => {
          const stateName = safeString(row.state_name).trim().toLowerCase();
          const countryId = countryMap.get(safeString(row.country_name).trim().toLowerCase());
          if (!stateName || !countryId) return null;
          return `${stateName}|${countryId}`;
        }).filter(Boolean)
      )];

      const missingStateMapping = stateMappingKeys.filter(k => !stateNameMap.has(k));

      if (missingStateMapping.length > 0) {
        errorStateMapping.push(...missingStateMapping);
      }

      // ----------------------------------------
      // CITY CHECK (Corrected)
      // ----------------------------------------
      const excelCityNames = [...new Set(
        excelData.map(r => safeString(r.city_name).trim().toLowerCase()).filter(Boolean)
      )];

      const dbCityNames = new Set(
        (await knex(CITIES.NAME).select("name"))
          .map(r => safeString(r.name).trim().toLowerCase())
      );

      // Missing cities (name only)
      const missingCityNames = excelCityNames.filter(name => !dbCityNames.has(name));

      if (missingCityNames.length > 0) {
        errorCityNames.push(...missingCityNames);
      }

      const errorCityMapping = [];

      const cityNameMap = new Map(
        (await knex(CITIES.NAME).select("id", "name", "state_id")).map(s => [
          `${safeString(s.name).trim().toLowerCase()}|${s.state_id}`,
          s.id
        ])
      );

      const cityMappingKeys = [...new Set(
        excelData.map(row => {
          const cityName = safeString(row.city_name).trim().toLowerCase();
          const stateName = safeString(row.state_name).trim().toLowerCase();
          const countryName = safeString(row.country_name).trim().toLowerCase();

          const countryId = countryMap.get(countryName);
          if (!countryId) return null;

          const stateKey = `${stateName}|${countryId}`;
          const stateId = stateNameMap.get(stateKey);
          if (!stateId || !cityName) return null;

          return `${cityName}|${stateId}`;
        }).filter(Boolean)
      )];

      const missingCityMapping = cityMappingKeys.filter(k => !cityNameMap.has(k));

      if (missingCityMapping.length > 0) {
        errorCityMapping.push(...missingCityMapping);
      }

      const allowedRegions = new Set([1, 2, 3]);
      const allowedWarehouseTypes = new Set(["Store", "Warehouse"]);
      const normalize = (v) => String(v || "").trim().toLowerCase();

      // ✅ Transform data with error mapping
      const result = excelData.map(supplier => {

        // Supplier name validation
        const supplierNameValue = safeString(supplier.supplier_name);

        const supplierNameError = errorSupplierNames.some(err =>
          normalize(err).includes(normalize(supplierNameValue))
        );

        const supplierErrorMessage = supplierNameError
          ? errorSupplierNames.find(err =>
            normalize(err).includes(normalize(supplierNameValue))
          )
          : "";

        // state errors
        const stateNameOnlyError = missingStateNames.some(
          name => normalize(name) === normalize(supplier.state_name)
        );

        const stateMappingError = errorStateMapping.some(key => {
          const [stateName, countryId] = key.split("|");
          if (normalize(stateName) !== normalize(supplier.state_name)) return false;

          const expectedCountryId = countryMap.get(normalize(supplier.country_name));
          return Number(countryId) === Number(expectedCountryId);
        });

        const stateError = stateNameOnlyError || stateMappingError;
        const stateErrorMessage = stateNameOnlyError
          ? "Invalid state name"
          : stateMappingError
            ? "State not mapped with selected country"
            : "";

        // city errors
        const cityNameOnlyError = missingCityNames.some(
          name => normalize(name) === normalize(supplier.city_name)
        );

        const cityMappingError = errorCityMapping.some(key => {
          const [cityName, stateId] = key.split("|");
          if (normalize(cityName) !== normalize(supplier.city_name)) return false;

          const expectedStateKey = `${normalize(supplier.state_name)}|${countryMap.get(normalize(supplier.country_name))}`;
          const expectedStateId = stateNameMap.get(expectedStateKey);

          return Number(stateId) === Number(expectedStateId);
        });

        const cityError = cityNameOnlyError || cityMappingError;
        const cityErrorMessage = cityNameOnlyError
          ? "Invalid city name"
          : cityMappingError
            ? "City not mapped with selected state"
            : "";

        // country error
        const countryError = missingCountryList.some(
          name => normalize(name) === normalize(safeString(supplier.country_name))
        );
        const countryErrorMessage = countryError ? "Invalid country name" : "";

        return {
          ...supplier,

          supplier_name: {
            value: supplierNameValue,
            error: supplierNameError,
            errorvalue: supplierErrorMessage
          },

          add1: { value: safeString(supplier.add1), error: false, errorvalue: "" },
          add2: { value: safeString(supplier.add2), error: false, errorvalue: "" },
          pincode: { value: safeString(supplier.pincode), error: false, errorvalue: "" },

          state_name: {
            value: safeString(supplier.state_name),
            error: stateError,
            errorvalue: stateErrorMessage
          },

          city_name: {
            value: safeString(supplier.city_name),
            error: cityError,
            errorvalue: cityErrorMessage
          },

          country_name: {
            value: safeString(supplier.country_name),
            error: countryError,
            errorvalue: countryErrorMessage
          },

          mobile: { value: safeString(supplier.mobile), error: false, errorvalue: "" },
          alter_mobile_no: { value: safeString(supplier.alter_mobile_no), error: false, errorvalue: "" },

          email: { value: safeString(supplier.email), error: false, errorvalue: "" },
          alter_email: { value: safeString(supplier.alter_email), error: false, errorvalue: "" },
          gstin: { value: safeString(supplier.gstin), error: false, errorvalue: "" },
          pan_number: { value: safeString(supplier.pan_number), error: false, errorvalue: "" },

          msme_applicable: { value: safeString(supplier.msme_applicable), error: false, errorvalue: "" },
          msme_declaration: { value: safeString(supplier.msme_declaration), error: false, errorvalue: "" },
          msme_number: { value: safeString(supplier.msme_number), error: false, errorvalue: "" },

          credit_days: { value: safeString(supplier.credit_days), error: false, errorvalue: "" },

          ac_name: { value: safeString(supplier.ac_name), error: false, errorvalue: "" },
          bankname: { value: safeString(supplier.bankname), error: false, errorvalue: "" },
          bank_ac_no: { value: safeString(supplier.bank_ac_no), error: false, errorvalue: "" },
          ifsccode: { value: safeString(supplier.ifsccode), error: false, errorvalue: "" },

          payment_terms: { value: safeString(supplier.payment_terms), error: false, errorvalue: "" },

          fssai_expiry: { value: safeString(supplier.fssai_expiry), error: false, errorvalue: "" },
          pan_status: { value: safeString(supplier.pan_status), error: false, errorvalue: "" },
          gst_status: { value: safeString(supplier.gst_status), error: false, errorvalue: "" },

          product_type: { value: safeString(supplier.product_type), error: false, errorvalue: "" },
          gst_type: { value: safeString(supplier.gst_type), error: false, errorvalue: "" },
          short_name: { value: safeString(supplier.short_name), error: false, errorvalue: "" },

          purchase: { value: safeString(supplier.purchase), error: false, errorvalue: "" },
          transfer: { value: safeString(supplier.transfer), error: false, errorvalue: "" },
          fssaino: { value: safeString(supplier.fssaino), error: false, errorvalue: "" },
          month_days: { value: safeString(supplier.month_days), error: false, errorvalue: "" },

          designation: { value: safeString(supplier.designation), error: false, errorvalue: "" },
          contact_person: { value: safeString(supplier.contact_person), error: false, errorvalue: "" },
          region_id: {
            value: safeString(supplier.region_id),
            error: !allowedRegions.has(Number(safeString(supplier.region_id))),
            errorvalue: !allowedRegions.has(Number(safeString(supplier.region_id)))
              ? "Region must be 1, 2, or 3"
              : ""
          },

          warehouse_type: {
            value: safeString(supplier.warehouse_type),
            error: !allowedWarehouseTypes.has(
              safeString(supplier.warehouse_type).trim()
            ),
            errorvalue: !allowedWarehouseTypes.has(
              safeString(supplier.warehouse_type).trim()
            )
              ? 'Warehouse type must be "Store" or "Warehouse"'
              : ""
          },

        };
      });



      await trx.commit();

      return result;

    } catch (error) {
      // Rollback transaction in case of any failure
      await trx.rollback();
      console.error("Transaction Failed:", error);

      if (error._code == 404 || error._code == 400) {
        throw error;
      }

      // Default to internal server error if it's not a known custom error
      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Supplier excel import failed.",
        property: "",
        code: "EXCEL_IMPORT_FAILED"
      });

    }
  }

  async function postExcelSupplierRepo({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { company_id, status } = params;
    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, {
      body,
      params,
      logTrace
    });
    const excelColumns = excelColumnData.headers;
    const excelData = excelColumnData.data;

    try {
      const errorMessages = [];
      const errorStateMapping = [];
      const errorStateNames = [];

      const requiredColumns = [
        "supplier_name",
        "add1",
        "add2",
        "pincode",
        "city_name",
        "state_name",
        "country_name",
        "mobile",
        "alter_mobile_no",
        "email",
        "alter_email",
        "gstin",
        "pan_number",
        "msme_applicable",
        "msme_number",
        "credit_days",
        "ac_name",
        "bankname",
        "bank_ac_no",
        "region_id",
        "warehouse_type"
      ];
      const allowedRegions = new Set([1, 2, 3]);
      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 4: Fetch DB Supplier Records
      const dbSupplierRaw = await knex(SUPPLIER.NAME)
        .select([
          SUPPLIER.COLUMNS.SUPPLIER_CODE,
          SUPPLIER.COLUMNS.SUPPLIER_NAME,
          SUPPLIER.COLUMNS.REGION_ID,
          SUPPLIER.COLUMNS.COMPANY_ID
        ]);

      // DB mapped array
      const dbSupplierMap = dbSupplierRaw.map(p => ({
        name: String(p[SUPPLIER.COLUMNS.SUPPLIER_NAME]).trim().toLowerCase(),
        region: Number(p[SUPPLIER.COLUMNS.REGION_ID]),
        company: Number(p[SUPPLIER.COLUMNS.COMPANY_ID]),
        code: String(p[SUPPLIER.COLUMNS.SUPPLIER_CODE]).trim()
      }));


      /*------------------------------------------------------------------*
         UPDATE MODE (status = 2)
         supplier_name + region_id + company_id must exist
      *------------------------------------------------------------------*/
      if (Number(status) === 2) {
        const invalidRows = excelData.filter(row => {
          const name = String(row.supplier_name).trim().toLowerCase();
          const region = Number(row.region_id);
          const company = Number(company_id);

          return !dbSupplierMap.some(db =>
            db.name === name &&
            db.region === region &&
            db.company === company
          );
        });

        if (invalidRows.length > 0) {
          const msg = invalidRows.map(r =>
            `${r.supplier_name} (Region: ${r.region_id}, Company: ${company_id})`
          );

          errorMessages.push(
            `Supplier Does Not Exist For Update: ${msg.join(", ")}`
          );
        }
      }


      /*------------------------------------------------------------------*
         INSERT MODE (status = 1)
         supplier_name + region_id + company_id  must be unique
      *------------------------------------------------------------------*/
      if (Number(status) === 1) {
        const duplicates = excelData.filter(row => {
          const name = String(row.supplier_name).trim().toLowerCase();
          const region = Number(row.region_id);
          const company = Number(company_id);

          return dbSupplierMap.some(db =>
            db.name === name &&
            db.region === region &&
            db.company === company
          );
        });

        if (duplicates.length > 0) {
          const msg = duplicates.map(r =>
            `${r.supplier_name} (Region: ${r.region_id}, Company: ${company_id})`
          );
          errorMessages.push(
            `Supplier Already Exists: ${msg.join(", ")}`
          );
        }
      }
      // Helper → Fetch categories in safe chunks
      async function fetchInChunks(trx, table, column, values, chunkSize = 300) {
        const result = [];

        for (let i = 0; i < values.length; i += chunkSize) {
          const chunk = values.slice(i, i + chunkSize);

          const placeholders = chunk.map(() => '?').join(',');

          const rows = await trx(table)
            .select("id", column)
            .whereRaw(`LOWER(TRIM(${column})) IN (${placeholders})`, chunk);

          result.push(...rows);
        }

        return result;
      }


      // ✅ Helper to safely return string
      const safeString = (val) => (typeof val === "string" ? val : (val != null ? String(val) : ""));
      const normalize = v => safeString(v).trim().toLowerCase();

      // ----------------------------------------
      // COUNTRY CHECK (Optimized)
      // ----------------------------------------
      const countryNames = [...new Set(
        excelData.map(p => safeString(p.country_name).trim().toLowerCase()).filter(Boolean)
      )];

      const existingCountries = await fetchInChunks(
        knex,
        COUNTRIES.NAME,
        COUNTRIES.COLUMNS.NAME,
        countryNames
      );

      const countryMap = new Map(
        existingCountries.map(c => [
          safeString(c.name).trim().toLowerCase(),
          c.id
        ])
      );

      // find missing countries
      const missingCountries = countryNames.filter(n => !countryMap.has(n));

      if (missingCountries.length > 0) {
        errorMessages.push(`Countries Not Found: ${missingCountries.join(", ")}`);
      }


      // ----------------------------------------
      // STATE CHECK
      // ----------------------------------------
      const excelStateNames = [...new Set(
        excelData.map(r => safeString(r.state_name).trim().toLowerCase()).filter(Boolean)
      )];

      const dbStateNames = new Set(
        (await knex(STATES.NAME).select("name"))
          .map(r => safeString(r.name).trim().toLowerCase())
      );

      // Missing states (name only)
      const missingStateNames = excelStateNames.filter(name => !dbStateNames.has(name));

      if (missingStateNames.length > 0) {
        errorMessages.push(
          `State Not Found: ${missingStateNames.join(", ")}`
        );
      }

      const dbStates = await knex(STATES.NAME).select("id", "name", "country_id");

      const stateNameOnlySet = new Set(
        dbStates.map(s => normalize(s.name))
      ); // just state names

      const stateMappingMap = new Map(
        dbStates.map(s => [
          `${normalize(s.name)}|${s.country_id}`,
          s.id
        ])
      );

      const excelStates = excelData.map(r => ({
        state: normalize(r.state_name),
        countryName: normalize(r.country_name)
      }));


      for (const row of excelStates) {
        const { state, countryName } = row;

        const countryId = countryMap.get(countryName);

        // 1️⃣ INVALID STATE NAME
        if (!stateNameOnlySet.has(state)) {
          errorStateNames.push(state);
          continue; // do NOT check mapping
        }

        // 2️⃣ VALID NAME → CHECK MAPPING
        const key = `${state}|${countryId}`;
        if (!stateMappingMap.has(key)) {
          errorStateMapping.push(key);
        }
      }

      if (errorStateNames.length > 0) {
        errorMessages.push(
          `Invalid State Name: ${errorStateNames.join(", ")}`
        );
      }

      if (errorStateMapping.length > 0) {
        const readable = errorStateMapping.map(k => {
          const [st, cid] = k.split("|");
          return `${st} (country_id: ${cid})`;
        });

        errorMessages.push(
          `State not mapped with selected country: ${readable.join(", ")}`
        );
      }

      // ----------------------------------------
      // CITY CHECK (Corrected)
      // ----------------------------------------
      const cityNameOnlySet = new Set(
        (await knex(CITIES.NAME).select("name"))
          .map(r => normalize(r.name))
      );

      const cityMappingMap = new Map(
        (await knex(CITIES.NAME).select("id", "name", "state_id")).map(c => [
          `${normalize(c.name)}|${c.state_id}`,
          c.id
        ])
      );

      const errorCityNames = [];      // invalid name only
      const errorCityMapping = [];    // mapping wrong
      for (const row of excelData) {

        const city = normalize(row.city_name);
        const state = normalize(row.state_name);
        const country = normalize(row.country_name);

        if (!city) continue;

        // 1️⃣ INVALID CITY NAME
        if (!cityNameOnlySet.has(city)) {
          errorCityNames.push(city);
          continue; // do NOT check mapping
        }

        // 2️⃣ VALID NAME → CHECK MAPPING
        const countryId = countryMap.get(country);
        if (!countryId) continue;

        const stateKey = `${state}|${countryId}`;
        const stateId = stateMappingMap.get(stateKey);

        if (!stateId) continue;

        const mappingKey = `${city}|${stateId}`;

        if (!cityMappingMap.has(mappingKey)) {
          errorCityMapping.push(mappingKey);
        }
      }

      if (errorCityNames.length > 0) {
        errorMessages.push(
          `Invalid City Name: ${errorCityNames.join(", ")}`
        );
      }

      if (errorCityMapping.length > 0) {
        const readable = errorCityMapping.map(k => {
          const [cityName, stateId] = k.split("|");
          return `${cityName} (state_id: ${stateId})`;
        });

        errorMessages.push(
          `City not mapped with selected state: ${readable.join(", ")}`
        );
      }

      excelData.forEach(supplier => {
        // REGION VALIDATION
        if (!allowedRegions.has(Number(safeString(supplier.region_id)))) {
          errorMessages.push(
            `Invalid Region ID for supplier "${supplier.supplier_name}": Must be 1, 2, or 3`
          );
        }

        // WAREHOUSE TYPE VALIDATION
        const allowedWarehouseTypes = new Set(["store", "warehouse"]);

        console.log(supplier.warehouse_type, "values");

        if (!allowedWarehouseTypes.has(normalize(supplier.warehouse_type))) {
          errorMessages.push(
            `Invalid Warehouse Type for supplier "${supplier.supplier_name}": Must be "Store" or "Warehouse"`
          );
        }

      });

      if (errorMessages.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: errorMessages.join(" | "),
          code: "VALIDATION_ERRORS"
        });
      }

      const existingCityMap = new Map(
        (await knex(CITIES.NAME).select("id", "name")).map(c => [
          normalize(c.name),
          c.id
        ])
      );

      const existingStateMap = new Map(
        (await knex(STATES.NAME).select("id", "name")).map(s => [
          normalize(s.name),
          s.id
        ])
      );

      const existingCountryMap = new Map(
        (await knex(COUNTRIES.NAME).select("id", "name")).map(c => [
          normalize(c.name),
          c.id
        ])
      );


      function excelDateToJSDate(excelSerial) {
        if (!excelSerial || isNaN(excelSerial)) return null;
        const jsDate = new Date((excelSerial - 25569) * 86400 * 1000);
        return jsDate.toISOString().split("T")[0];
      }

      // Get max id for creating supplier_id
      const [{ max_id: maxIdRaw = 0 }] = await knex(SUPPLIER.NAME).max("id as max_id");
      let maxId = Number(maxIdRaw) || 0;

      const suppliersToInsert = [];
      const suppliersToUpdate = [];
      const seenSuppliers = new Set();

      for (const supplierRow of excelData) {
        const {
          supplier_name,
          add1,
          add2,
          pincode,
          city_name,
          state_name,
          country_name,
          mobile,
          alter_mobile_no,
          email,
          alter_email,
          gstin,
          pan_number,
          msme_applicable,
          msme_number,
          msme_declaration,
          opening_balance = 0,
          balance = 0,
          credit_days,
          tot_margin_percentage = 0,
          tot_margin_value = 0,
          ac_name,
          bankname,
          bank_ac_no,
          ifsccode,
          payment_terms,
          gst_type,
          fssai_expiry,
          pan_status,
          gst_status,
          product_type,
          short_name,
          purchase,
          transfer,
          fssaino,
          month_days,
          designation,
          contact_person,
          region_id,
          warehouse_type
        } = supplierRow;
        console.log(`Processing Supplier: ${supplier_name}`);

        const existingCityId = existingCityMap.get(normalize(city_name)) || null;
        const existingStateId = existingStateMap.get(normalize(state_name)) || null;
        const existingCountryId = existingCountryMap.get(normalize(country_name)) || null;

        const supplierDataObject = {
          [SUPPLIER.COLUMNS.SUPPLIER_NAME]: supplier_name,
          [SUPPLIER.COLUMNS.SHORTNAME]: short_name,
          [SUPPLIER.COLUMNS.ADD1]: add1,
          [SUPPLIER.COLUMNS.ADD2]: add2,
          [SUPPLIER.COLUMNS.ADD3]: '',
          [SUPPLIER.COLUMNS.ADD2]: '',
          [SUPPLIER.COLUMNS.COMPANY_ID]: company_id,
          [SUPPLIER.COLUMNS.COUNTRY_ID]: existingCountryId || 0,
          [SUPPLIER.COLUMNS.STATE_ID]: existingStateId || 0,
          [SUPPLIER.COLUMNS.CITY_ID]: existingCityId || 0,
          [SUPPLIER.COLUMNS.PINCODE]: pincode,
          [SUPPLIER.COLUMNS.MOBILE]: mobile,
          [SUPPLIER.COLUMNS.PHONE]: '',
          [SUPPLIER.COLUMNS.EMAIL]: email,
          [SUPPLIER.COLUMNS.WEBSITE]: '',
          [SUPPLIER.COLUMNS.GSTIN]: gstin,
          [SUPPLIER.COLUMNS.GST_TYPE]: gst_type ?? 2,
          [SUPPLIER.COLUMNS.BANK_AC_NO]: bank_ac_no,
          [SUPPLIER.COLUMNS.BANKNAME]: bankname,
          [SUPPLIER.COLUMNS.PAN_NUMBER]: pan_number,
          [SUPPLIER.COLUMNS.AC_NAME]: ac_name,
          [SUPPLIER.COLUMNS.IFSCCODE]: ifsccode,
          [SUPPLIER.COLUMNS.FSSAI]: fssaino,
          [SUPPLIER.COLUMNS.OP_BAL]: opening_balance,
          [SUPPLIER.COLUMNS.BALANCE]: balance,
          [SUPPLIER.COLUMNS.MONTH_DAYS]: Number(month_days) || 0,
          [SUPPLIER.COLUMNS.MSME_APPLICABLE]: msme_applicable,
          [SUPPLIER.COLUMNS.MSME_NUMBER]: msme_applicable ? String(msme_number) : "",
          [SUPPLIER.COLUMNS.MSME_DECLARATION]: msme_applicable ? String(msme_declaration) : "",
          [SUPPLIER.COLUMNS.CREDIT_DAYS]: Number(credit_days) || 0,
          [SUPPLIER.COLUMNS.TOT_MARGIN_PERCENTAGE]: Number(tot_margin_percentage) || 0,
          [SUPPLIER.COLUMNS.TOT_MARGIN_VALUE]: Number(tot_margin_value) || 0,
          [SUPPLIER.COLUMNS.CONTACT_PERSON]: contact_person || "",
          [SUPPLIER.COLUMNS.DESIGNATION]: designation || "",
          [SUPPLIER.COLUMNS.ALTER_MOBILE_NO]: alter_mobile_no || '',
          [SUPPLIER.COLUMNS.ALTER_EMAIL]: alter_email || '',
          [SUPPLIER.COLUMNS.IS_ACTIVE]: false,
          [SUPPLIER.COLUMNS.PAYMENT_TERMS]: payment_terms,
          [SUPPLIER.COLUMNS.FSSAI_EXPIRY]: excelDateToJSDate(fssai_expiry),
          [SUPPLIER.COLUMNS.PAN_STATUS]: pan_status,
          [SUPPLIER.COLUMNS.GST_STATUS]: gst_status,
          [SUPPLIER.COLUMNS.PRODUCT_TYPE]: product_type,
          [SUPPLIER.COLUMNS.PURCHASE]: purchase,
          [SUPPLIER.COLUMNS.TRANSFER]: transfer,
          [SUPPLIER.COLUMNS.REGION_ID]: region_id,
          [SUPPLIER.COLUMNS.WAREHOUSE_TYPE]: String(warehouse_type) === 'Warehouse' ? 1 : 2,
          [SUPPLIER.COLUMNS.OUTLET]: String(warehouse_type) === 'Store' ? 'true' : 'false',
          [SUPPLIER.COLUMNS.WAREHOUSE]: String(warehouse_type) === 'Warehouse' ? 'true' : 'false'
        };

        console.log("insert", supplierDataObject)

        // const nameKey = String(supplier_name).trim().toLowerCase();

        switch (Number(status)) {
          case 1:
            console.log("supplier insert");
            // 1️⃣ Generate new supplier_id
            const newSupplierId = ++maxId;

            // 2️⃣ Fetch last supplier in same region
            const [lastSupplier] = await knex(SUPPLIER.NAME)
              .select(SUPPLIER.COLUMNS.SUPPLIER_CODE)
              .where(SUPPLIER.COLUMNS.REGION_ID, Number(region_id))
              .orderBy(SUPPLIER.COLUMNS.ID, "DESC")
              .limit(1);

            // 3️⃣ Get prefix letter based on region
            const regionPrefix =
              Number(region_id) === 1 ? "C" :
                Number(region_id) === 2 ? "B" :
                  Number(region_id) === 3 ? "H" :
                    null;

            if (!regionPrefix) {
              throw CustomError.create({
                httpCode: 400,
                message: "Invalid Region ID",
                property: "region_id",
                code: "INVALID_REGION"
              });
            }

            // 4️⃣ Determine next running number
            let nextNumber = 1;
            console.log(lastSupplier?.supplier_code, newSupplierId, "values")
            if (lastSupplier?.supplier_code) {
              const code = String(lastSupplier.supplier_code);  // e.g. "C024"
              const numberPart = parseInt(code.slice(1), 10);   // 24
              nextNumber = numberPart + 1;                      // 25
            }

            // 5️⃣ Format with 3 digits → C025
            const newSupplierCode = `${regionPrefix}${String(nextNumber).padStart(3, "0")}`;

            console.log("Next Supplier Code:", newSupplierCode);

            // 2️⃣ Insert product with outlet_product_id
            suppliersToInsert.push({
              ...supplierDataObject,
              [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
              [SUPPLIER.COLUMNS.CREATED_AT]: new Date(),
              [SUPPLIER.COLUMNS.ID]: newSupplierId,
              [SUPPLIER.COLUMNS.SUPPLIER_CODE]: newSupplierCode // ✅ store same ID
            });

            break;

          case 2:
            console.log("supplier update");
            // ✅ Step 1: Get current item info
            const [{ id: updatedSupplierId, supplier_code: updatedSupplierCode }] = await trx(SUPPLIER.NAME)
              .select(SUPPLIER.COLUMNS.ID, SUPPLIER.COLUMNS.SUPPLIER_CODE)
              .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, supplier_name)
              .where(SUPPLIER.COLUMNS.REGION_ID, region_id)
              .andWhere(SUPPLIER.COLUMNS.COMPANY_ID, company_id)
              .limit(1);
            console.log("supplier update", updatedSupplierId, updatedSupplierCode);
            suppliersToUpdate.push({
              ...supplierDataObject,
              [SUPPLIER.COLUMNS.ID]: updatedSupplierId,
              [SUPPLIER.COLUMNS.SUPPLIER_CODE]: updatedSupplierCode,
              [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id,
              [SUPPLIER.COLUMNS.UPDATED_AT]: new Date()
            });
            break;
          default:
            throw CustomError.create({
              httpCode: StatusCodes.BAD_REQUEST,
              message: `Invalid Status Type`,
              property: "Status Type",
              code: "INVALID_STATUS_TYPE"
            });
        }
      }

      await insertInBatches(trx, SUPPLIER.NAME, suppliersToInsert,
        [
          SUPPLIER.COLUMNS.ID,
          SUPPLIER.COLUMNS.SUPPLIER_CODE,
          SUPPLIER.COLUMNS.REGION_ID
        ],
        {
          [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [SUPPLIER.COLUMNS.IS_ACTIVE]: false
        }
      );

      await updateInBatches(
        trx,
        SUPPLIER.NAME,
        suppliersToUpdate,     // [{id: 1, name: "Pen"}, {id: 2, name: "Book"}]
        [
          SUPPLIER.COLUMNS.ID
        ],
        {
          [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id,
          [SUPPLIER.COLUMNS.UPDATED_AT]: knex.fn.now(),
          [SUPPLIER.COLUMNS.IS_ACTIVE]: false
        }
      );

      await trx.commit();
      console.log("Transaction completed successfully!");
      return { "success": true }

    } catch (error) {
      await trx.rollback();
      console.error("Transaction Failed:", error);

      if (error._code == 404 || error._code == 400) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Supplier excel import failed.",
        property: "",
        code: "EXCEL_IMPORT_FAILED"
      });
    }
  }

  async function getSuplierOrderDaysExportRepo({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const query = knex
      .select([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_CODE}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as outlet_id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as stroe_code`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY} as sunday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY} as monday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY} as tuesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY} as wednesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY} as thursday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY} as friday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY} as saturday`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`
      )
      .leftJoin(
        `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .where({
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`]: company_id,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id,
        [`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`]: true
      })
      .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, "ASC");

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier mapping not found for the given outlet",
        code: "NOT_FOUND"
      });

    }

    return response;
  }

  async function getSuplierOrderDaysWithBrandNameExportRepo({ body, params, logTrace, queryString }) {
    const knex = this;
    const { company_id, outlet_id } = params;

    const query = knex
      .select([
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID} as supplier_id`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE} as supplier_code`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME} as supplier_name`,

        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,

        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY} as sunday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY} as monday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY} as tuesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY} as wednesday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY} as thursday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY} as friday`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY} as saturday`
      ])
      .from(`${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`)
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .where({
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID}`]: company_id,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`]: true,
        [`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`]: outlet_id
      })
      .orderBy(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE}`, "ASC");


    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier mapping not found for the given outlet",
        code: "NOT_FOUND"
      });

    }

    return response;
  }


  async function getBrandCompanyBasedSupplierOrderDaysExportRepo({ body, params, logTrace, queryString }) {
    const knex = this;
    const { outlet_id, region_id, company_id } = params;
    const { search } = queryString;


    let query = knex(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .select([
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company`,

        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY} THEN 1 ELSE 0 END) as sunday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY} THEN 1 ELSE 0 END) as monday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY} THEN 1 ELSE 0 END) as tuesday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY} THEN 1 ELSE 0 END) as wednesday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY} THEN 1 ELSE 0 END) as thursday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY} THEN 1 ELSE 0 END) as friday`),
        // knex.raw(`MAX(CASE WHEN ${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY} THEN 1 ELSE 0 END) as saturday`)

        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY} THEN 1 ELSE 0 END), 0) as sunday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY} THEN 1 ELSE 0 END), 0) as monday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY} THEN 1 ELSE 0 END), 0) as tuesday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY} THEN 1 ELSE 0 END), 0) as wednesday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY} THEN 1 ELSE 0 END), 0) as thursday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY} THEN 1 ELSE 0 END), 0) as friday`),
        knex.raw(`COALESCE(MAX(CASE WHEN ${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY} THEN 1 ELSE 0 END), 0) as saturday`)

      ])
      // CORRECT JOIN (item table)
      .innerJoin(
        ITEM.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
      )

      // Join typedesign
      .innerJoin(
        TYPEDESIGN.NAME,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPEDESIGN_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )

      // Join outlets (mandatory because you filter outlets.is_active)
      .innerJoin(
        OUTLETS.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )

      // Join supplier
      .leftJoin(
        SUPPLIER.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )

      .leftJoin(
        OUTLET_SUPPLIER_ORDERDAYS.NAME,
        function () {
          this.on(
            `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
            '=',
            `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID}`
          )
            .andOn(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
              '=',
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID}`
            )
            .andOn(
              `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
              '=',
              `${OUTLET_SUPPLIER_ORDERDAYS.NAME}.${OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID}`
            );
        }
      )

      // WHERE conditions
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, '>', 0)
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.COMPANY_ID}`, 1)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);


    // REGION FILTER (region selected & outlet_id = -1)
    if (Number(region_id)) {

      // Get outlets under region
      let outletIdsQuery = knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      // If specific outlet also passed → restrict to that
      if (Number(outlet_id) !== -1) {
        outletIdsQuery.andWhere(OUTLETS.COLUMNS.ID, Number(outlet_id));
      }

      const outletIds = await outletIdsQuery;

      if (outletIds.length === 0) return [];

      // Apply in main query
      query.whereIn(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`, outletIds);
    }

    query.groupBy(
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`
    );

    if (search && search.length >= 2) {
      query.where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ilike", `%${search}%`);
    }


    query.orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Brand Company Wise Order Days",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No brand-wise supplier order days found.",
        code: "NOT_FOUND"
      });
    }

    return response;

  }

  async function postSupplierOrderDaysExcelImportRepo({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { company_id, outlet_id } = params;
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      // Step 1: Upload and extract Excel data
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
      const excelColumns = excelColumnData.headers.map(h => String(h).toLowerCase().trim());
      const excelData = excelColumnData.data;

      // Step 2: Define required columns
      const requiredColumns = [
        "brand_company",
        "supplier_code",
        // "supplier",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];

      // Step 3: Validate required columns
      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 4: Validate that there is data
      if (!excelData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No supplier order day records found in Excel.",
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 5: Prepare data for insert/update using the transaction 'trx' we created
      for (const rawSupplier of excelData) {
        // normalize and trim inputs
        const brand_company = rawSupplier.brand_company ? String(rawSupplier.brand_company).trim() : "";
        const supplier_code = rawSupplier.supplier_code ? String(rawSupplier.supplier_code).trim() : "";

        // days — try to coerce to boolean (or keep as-is if your DB expects 0/1)
        const sunday = Boolean(rawSupplier.sunday);
        const monday = Boolean(rawSupplier.monday);
        const tuesday = Boolean(rawSupplier.tuesday);
        const wednesday = Boolean(rawSupplier.wednesday);
        const thursday = Boolean(rawSupplier.thursday);
        const friday = Boolean(rawSupplier.friday);
        const saturday = Boolean(rawSupplier.saturday);

        if (!brand_company) {
          // skip or throw depending on your preference — here we throw
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Brand company is required for a row.`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }

        // Get brand company id
        const brandRecord = await trx(TYPEDESIGN.NAME)
          .where({
            [TYPEDESIGN.COLUMNS.TYPE_NAME]: brand_company,
            [TYPEDESIGN.COLUMNS.COMPANY_ID]: company_id,
            [TYPEDESIGN.COLUMNS.IS_ACTIVE]: true
          })
          .select(TYPEDESIGN.COLUMNS.ID)
          .first();

        if (!brandRecord) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `Brand company "${brand_company}" not found for company ID ${company_id}.`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }

        const brand_company_id = brandRecord[TYPEDESIGN.COLUMNS.ID];

        // supplier_code must be present to find mapping; otherwise skip row
        if (!supplier_code) {
          // You can choose to continue instead of throwing. I'm continuing to match prior behavior.
          console.log("Skipping row because supplier_code is empty for brand:", brand_company);
          continue;
        }

        // Find mapping row (and supplier_id) using supplier_code, outlet_id, company_id
        const mappingRow = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
          .select(
            SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
            SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE
          )
          .where({
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: supplier_code,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
          })
          .first();

        if (!mappingRow) {
          console.log(`Mapping not found for Supplier ${supplier_code} & Outlet ${outlet_id}`);
          continue; // skip this supplier as per your earlier behavior
        }

        const supplier_id = mappingRow[SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID];

        // Update supplier_outlet_mapping ONLY for this supplier row
        await trx(SUPPLIER_OUTLET_MAPPING.NAME)
          .where({
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: supplier_code,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
          })
          .update({
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
          });

        // Now find existing orderdays record for this supplier
        const existingOrderdays = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
          .first(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID)
          .where({
            [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
            [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id
          });

        if (!existingOrderdays) {
          await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
            .insert({
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.IS_ACTIVE]: true,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_BY]: userDetails.id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_AT]: trx.fn.now(),
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
            });
        } else {
          await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
            .where({ [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID]: existingOrderdays.id })
            .update({
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
              [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
            });
        }
      }

      // commit once after all rows processed
      await trx.commit();
      console.log("Transaction completed successfully!");
      return { success: true };

    } catch (error) {
      // rollback and rethrow
      try { await trx.rollback(); } catch (e) { console.error("Rollback failed", e); }
      console.error("Transaction Failed:", error);

      if (error._code === 404 || error._code === 400) {
        throw error;
      }

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Supplier Order Days Excel import failed.",
        property: "",
        code: "EXCEL_IMPORT_FAILED"
      });
    }
  }


  //   async function postSupplierOrderDaysExcelImportRepo({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const { company_id, outlet_id } = params;
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {
  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h => h.toLowerCase().trim());
  //     const excelData = excelColumnData.data;

  //     const requiredColumns = [
  //       "brand_company",
  //       "supplier_code",
  //       "supplier",
  //       "sunday",
  //       "monday",
  //       "tuesday",
  //       "wednesday",
  //       "thursday",
  //       "friday",
  //       "saturday"
  //     ];

  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No supplier order day records found in Excel.",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 3: Process Excel data
  //     await knex.transaction(async (trx) => {
  //       for (const supplier of excelData) {
  //         const {
  //           brand_company,
  //           supplier_code,
  //           supplier: supplierName,
  //           sunday, monday, tuesday, wednesday, thursday, friday, saturday
  //         } = supplier;

  //         if (!brand_company?.trim()) {
  //           throw CustomError.create({
  //             httpCode: StatusCodes.BAD_REQUEST,
  //             message: `Brand company name missing for supplier "${supplierName || supplier_code}".`,
  //             code: "EXCEL_IMPORT_FAILED"
  //           });
  //         }

  //         const brandRecord = await trx(TYPEDESIGN.NAME)
  //           .where({
  //             [TYPEDESIGN.COLUMNS.TYPE_NAME]: brand_company.trim(),
  //             [TYPEDESIGN.COLUMNS.COMPANY_ID]: company_id,
  //             [TYPEDESIGN.COLUMNS.IS_ACTIVE]: true
  //           })
  //           .select(TYPEDESIGN.COLUMNS.ID)
  //           .first();

  //         if (!brandRecord) {
  //           throw CustomError.create({
  //             httpCode: StatusCodes.BAD_REQUEST,
  //             message: `Brand company "${brand_company}" not found for company ID ${company_id}.`,
  //             code: "EXCEL_IMPORT_FAILED"
  //           });
  //         }

  //         const brand_company_id = brandRecord[TYPEDESIGN.COLUMNS.ID];

  //         if (supplier_code) {
  //           const existing = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //             .where({
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: String(supplier_code),
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id
  //             })
  //             .first();

  //           if (!existing) {
  //             console.log(`Mapping not found for Supplier ${supplier_code} & Outlet ${outlet_id}`);
  //             continue;
  //           }

  //           await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //             .where({
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: supplier_code,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id
  //             })
  //             .update({
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now()
  //             });
  //         }
  //       }
  //     });

  //     console.log("✅ Transaction completed successfully!");
  //     return { success: true };

  //   } catch (error) {
  //     console.error("❌ Transaction Failed:", error);
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: error.message || "Supplier Order Days Excel import failed.",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });
  //   }
  // }

  // async function postSupplierOrderDaysExcelImportBrandBasedRepo({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { company_id, outlet_id } = params;
  //   const { uploadExcelData } = excelImportRepo(fastify);
  //   try {
  //     const excelColumnData = await uploadExcelData.call(knex, {
  //       body,
  //       params,
  //       logTrace
  //     });
  //     const excelColumns = excelColumnData.headers;
  //     const excelData = excelColumnData.data;

  //     const requiredColumns = [
  //       "brand_company",
  //       "sunday",
  //       "monday",
  //       "tuesday",
  //       "wednesday",
  //       "thursday",
  //       "friday",
  //       "saturday"
  //     ];

  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.NOT_FOUND,
  //         message: "No records found in Excel.",
  //         code: "NOT_FOUND"
  //       });
  //     }

  //     // Step 1: Process each supplier order days and its variants
  //     for (const supplierOrderDays of excelData) {
  //       const {
  //         brand_company,
  //         sunday,
  //         monday,
  //         tuesday,
  //         wednesday,
  //         thursday,
  //         friday,
  //         saturday
  //       } = supplierOrderDays;
  //       // STEP 2: Unique, cleaned brand company names from Excel
  //       const brandCompanyNames = [...new Set(
  //         excelData
  //           .map(p => String(p.brand_company || "").trim().toLowerCase())
  //           .filter(Boolean)
  //       )];

  //       // Fetch existing brands from DB with case-insensitive check
  //       const existingBrandCompanyRows = await trx(TYPEDESIGN.NAME)
  //         .select(TYPEDESIGN.COLUMNS.ID, TYPEDESIGN.COLUMNS.TYPE_NAME)
  //         .whereRaw(
  //           `LOWER(TRIM(??)) IN (${brandCompanyNames.map(() => '?').join(',')})`,
  //           [TYPEDESIGN.COLUMNS.TYPE_NAME, ...brandCompanyNames]
  //         );

  //       // Create map of existing brands
  //       const existingBrandCompanyMap = new Map(
  //         existingBrandCompanyRows.map(b => [
  //           String(b[TYPEDESIGN.COLUMNS.TYPE_NAME]).trim().toLowerCase(),
  //           b[TYPEDESIGN.COLUMNS.ID]
  //         ])
  //       );

  //       const items = await trx(ITEM.NAME)
  //         .select(ITEM.COLUMNS.OUTLET_PRODUCT_ID)
  //         .where({
  //           [ITEM.COLUMNS.TYPEDESIGN_ID]: brand_id,
  //           [ITEM.COLUMNS.COMPANY_ID]: company_id
  //         });

  //       if (!items.length) continue;

  //       // console.log('============itemsLength=============', items.length)


  //       const itemIds = items.map(i => i[ITEM.COLUMNS.OUTLET_PRODUCT_ID]);
  //       const chunkArray = (array, size) =>
  //         array.reduce((acc, _, i) =>
  //           (i % size ? acc : [...acc, array.slice(i, i + size)]), []);

  //       const itemIdChunks = chunkArray(itemIds, 1000);

  //       //  console.log('============itemIdChunks=============', itemIdChunks)

  //       let supplierIds = new Set();

  //       for (const chunk of itemIdChunks) {
  //         const outletMappings = await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //           .distinct(OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID)
  //           .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, chunk)
  //           .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //           .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //         outletMappings.forEach(r =>
  //           supplierIds.add(r[OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID])
  //         );
  //       }

  //       supplierIds = Array.from(supplierIds).filter(id => id && id != 0);

  //       if (!supplierIds.length) continue;

  //       //  console.log('============supplierIds=============', supplierIds)

  //       const existingSupplierRows = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //         .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID)
  //         .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, supplierIds)
  //         .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //         .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //       const existingSupplierIds = existingSupplierRows.map(row => row.supplier_id);

  //       if (!existingSupplierIds.length) continue;

  //       // console.log("Existing suppliers (valid for update):", existingSupplierIds);

  //       await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //         .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, existingSupplierIds)
  //         .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //         .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id)
  //         .update({
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //         });

  //       for (const supplier_id of existingSupplierIds) {

  //         const existing = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //           .first(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID)
  //           .where({
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id
  //           });

  //         if (!existing) {
  //           await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME).insert({
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.IS_ACTIVE]: true,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_BY]: userDetails.id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_AT]: trx.fn.now(),
  //             [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //           });
  //         } else {
  //           await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //             .where({ [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID]: existing.id })
  //             .update({
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //             });
  //         }
  //       }

  //       for (const chunk of itemIdChunks) {
  //         await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //           .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, chunk)
  //           .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //           .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id)
  //           .update({
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY]: sunday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY]: monday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY]: thursday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY]: friday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY]: saturday,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //           });
  //       }
  //     }

  //       console.log("existingBrandCompanyRows", existingBrandCompanyRows)
  //       console.log("existingBrandCompanyMap", existingBrandCompanyMap)
  //     }
  //     // await knex.transaction(async (trx) => {
  //     //   for (const row of excelData) {

  //     //     const {
  //     //       brand_company,
  //     //       sunday, monday, tuesday, wednesday,
  //     //       thursday, friday, saturday
  //     //     } = row;

  //     //     const brandRecord = await trx(TYPEDESIGN.NAME)
  //     //       .select(TYPEDESIGN.COLUMNS.ID)
  //     //       .whereRaw(`LOWER(${TYPEDESIGN.COLUMNS.TYPE_NAME}) = ?`, [
  //     //         brand_company.trim().toLowerCase()
  //     //       ])
  //     //       .andWhere(TYPEDESIGN.COLUMNS.COMPANY_ID, company_id)
  //     //       .andWhere(TYPEDESIGN.COLUMNS.IS_ACTIVE, true)
  //     //       .first();

  //     //     if (!brandRecord) {
  //     //       throw CustomError.create({
  //     //         httpCode: StatusCodes.NOT_FOUND,
  //     //         message: `Brand "${brand_company}" not found in system.`,
  //     //         code: "NOT_FOUND"
  //     //       });
  //     //     }

  //     //     const brand_id = brandRecord[TYPEDESIGN.COLUMNS.ID];

  //     //     // console.log('============brand_id=============', brand_id)

  //         // const items = await trx(ITEM.NAME)
  //         //   .select(ITEM.COLUMNS.ID)
  //         //   .where({
  //         //     [ITEM.COLUMNS.TYPEDESIGN_ID]: brand_id,
  //         //     [ITEM.COLUMNS.COMPANY_ID]: company_id
  //         //   });

  //         // if (!items.length) continue;

  //         // // console.log('============itemsLength=============', items.length)


  //         // const itemIds = items.map(i => i[ITEM.COLUMNS.ID]);

  //     //     // console.log('============itemIds=============', itemIds)

  //         const chunkArray = (array, size) =>
  //           array.reduce((acc, _, i) =>
  //             (i % size ? acc : [...acc, array.slice(i, i + size)]), []);

  //         const itemIdChunks = chunkArray(itemIds, 1000);

  //         //  console.log('============itemIdChunks=============', itemIdChunks)

  //         let supplierIds = new Set();

  //         for (const chunk of itemIdChunks) {
  //           const outletMappings = await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //             .distinct(OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID)
  //             .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, chunk)
  //             .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //             .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //           outletMappings.forEach(r =>
  //             supplierIds.add(r[OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID])
  //           );
  //         }

  //         supplierIds = Array.from(supplierIds).filter(id => id && id != 0);

  //         if (!supplierIds.length) continue;

  //         //  console.log('============supplierIds=============', supplierIds)

  //         const existingSupplierRows = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //           .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID)
  //           .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, supplierIds)
  //           .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //           .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id);

  //         const existingSupplierIds = existingSupplierRows.map(row => row.supplier_id);

  //         if (!existingSupplierIds.length) continue;

  //         // console.log("Existing suppliers (valid for update):", existingSupplierIds);

  //         await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //           .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, existingSupplierIds)
  //           .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //           .andWhere(SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID, company_id)
  //           .update({
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUNDAY]: sunday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.MONDAY]: monday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.THURSDAY]: thursday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.FRIDAY]: friday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.SATURDAY]: saturday,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //           });

  //         for (const supplier_id of existingSupplierIds) {

  //           const existing = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //             .first(OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID)
  //             .where({
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id
  //             });

  //           if (!existing) {
  //             await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME).insert({
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUPPLIER_ID]: supplier_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.OUTLET_ID]: outlet_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.COMPANY_ID]: company_id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.IS_ACTIVE]: true,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_BY]: userDetails.id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.CREATED_AT]: trx.fn.now(),
  //               [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //             });
  //           } else {
  //             await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
  //               .where({ [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.ID]: existing.id })
  //               .update({
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SUNDAY]: sunday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.MONDAY]: monday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.TUESDAY]: tuesday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.WEDNESDAY]: wednesday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.THURSDAY]: thursday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.FRIDAY]: friday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.SATURDAY]: saturday,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_BY]: userDetails.id,
  //                 [OUTLET_SUPPLIER_ORDERDAYS.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //               });
  //           }
  //         }

  //         for (const chunk of itemIdChunks) {
  //           await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //             .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, chunk)
  //             .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id)
  //             .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id)
  //             .update({
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.SUNDAY]: sunday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.MONDAY]: monday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.TUESDAY]: tuesday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.WEDNESDAY]: wednesday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.THURSDAY]: thursday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.FRIDAY]: friday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.SATURDAY]: saturday,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_id,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //               [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //             });
  //         }
  //       }
  //     });

  //     await trx.commit();
  //     return { success: true };

  //   } catch (error) {
  //     await trx.rollback();
  //     // console.log("Actual Error:", error);

  //     if (error && (error._errors || error._code)) {
  //       throw error;
  //     }

  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: error.message || "Unknown error occurred",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });
  //   }
  // }

  async function postSupplierOrderDaysExcelImportBrandBasedRepo({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);
    const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
    const { headers: excelColumns, data: excelData } = excelColumnData;

    const { outlet_id, company_id, region_id } = params;

    // ----------------------------------------------------
    // VALIDATION — region_id AND outlet_id REQUIRED
    // ----------------------------------------------------
    if (!Number(region_id) || !Number(outlet_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id and outlet_id are required",
        code: "INVALID_INPUT"
      });
    }

    // ----------------------------------------------------
    // STEP 1 — Required Excel Columns
    // ----------------------------------------------------
    const requiredColumns = [
      "brand_company", "sunday", "monday", "tuesday",
      "wednesday", "thursday", "friday", "saturday"
    ];
    const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
    if (missingColumns.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: `Missing required columns: ${missingColumns.join(", ")}`,
        code: "EXCEL_IMPORT_FAILED"
      });
    }
    if (!Array.isArray(excelData) || excelData.length === 0) return { updated: 0 };

    // ----------------------------------------------------
    // STEP 2 — Normalize Excel Rows
    // ----------------------------------------------------
    const normalizedRows = excelData
      .map(r => ({
        brand_company: String(r.brand_company || "").trim(),
        sunday: r.sunday?.toString().toLowerCase() === 'true' ? 1 : 0,
        monday: r.monday?.toString().toLowerCase() === 'true' ? 1 : 0,
        tuesday: r.tuesday?.toString().toLowerCase() === 'true' ? 1 : 0,
        wednesday: r.wednesday?.toString().toLowerCase() === 'true' ? 1 : 0,
        thursday: r.thursday?.toString().toLowerCase() === 'true' ? 1 : 0,
        friday: r.friday?.toString().toLowerCase() === 'true' ? 1 : 0,
        saturday: r.saturday?.toString().toLowerCase() === 'true' ? 1 : 0
      }))
      .filter(r => r.brand_company);

    if (!normalizedRows.length) return { updated: 0 };

    // ----------------------------------------------------
    // STEP 3 — Map brand names to brand IDs
    // ----------------------------------------------------
    const brandNamesUnique = [...new Set(normalizedRows.map(r => r.brand_company.toLowerCase()))];

    const existingBrandRows = await trx(TYPEDESIGN.NAME)
      .select(TYPEDESIGN.COLUMNS.ID, TYPEDESIGN.COLUMNS.TYPE_NAME)
      .whereRaw(
        `LOWER(TRIM(${TYPEDESIGN.COLUMNS.TYPE_NAME})) IN (${brandNamesUnique.map(() => '?').join(',')})`,
        brandNamesUnique
      )
      .andWhere(TYPEDESIGN.COLUMNS.COMPANY_ID, company_id);

    const brandCompanyNameToId = new Map(
      existingBrandRows.map(b => [b[TYPEDESIGN.COLUMNS.TYPE_NAME].trim().toLowerCase(), b[TYPEDESIGN.COLUMNS.ID]])
    );

    const normalizedRowsMap = new Map();
    for (const r of normalizedRows) {
      const brandId = brandCompanyNameToId.get(r.brand_company.toLowerCase());
      if (brandId) normalizedRowsMap.set(brandId, r);
    }
    if (!normalizedRowsMap.size) return { updated: 0 };

    const brandCompanyIds = [...normalizedRowsMap.keys()];

    // ----------------------------------------------------
    // REGION + OUTLET FILTER PREPARATION (GLOBAL)
    // ----------------------------------------------------
    let regionOutletIds = await trx(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (Number(outlet_id) !== -1) {
      regionOutletIds = regionOutletIds.filter(id => id === Number(outlet_id));
    }

    if (!regionOutletIds.length) {
      await trx.rollback();
      return { updated: 0, message: "No outlets found for given region/outlet." };
    }

    const outletIdFilter = regionOutletIds;

    // ----------------------------------------------------
    // STEP 4 — Fetch items by brand
    // ----------------------------------------------------
    const itemRows = await trx(ITEM.NAME)
      .select(ITEM.COLUMNS.OUTLET_PRODUCT_ID, ITEM.COLUMNS.TYPEDESIGN_ID)
      .whereIn(ITEM.COLUMNS.TYPEDESIGN_ID, brandCompanyIds)
      .andWhere(ITEM.COLUMNS.COMPANY_ID, company_id)
      .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

    const itemsByBrand = {};
    for (const r of itemRows) {
      const brandId = r[ITEM.COLUMNS.TYPEDESIGN_ID];
      if (!itemsByBrand[brandId]) itemsByBrand[brandId] = [];
      itemsByBrand[brandId].push(r[ITEM.COLUMNS.OUTLET_PRODUCT_ID]);
    }

    // ----------------------------------------------------
    // STEP 5 — Update OUTLET_PRODUCT_MAPPING
    // ----------------------------------------------------
    let totalUpdatedProducts = 0;

    for (const [brandId, productIds] of Object.entries(itemsByBrand)) {
      const excelRow = normalizedRowsMap.get(Number(brandId));
      if (!excelRow) continue;

      const updatedCount = await trx(OUTLET_PRODUCT_MAPPING.NAME)
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID, productIds)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, company_id)
        .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID, brandId)
        .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIdFilter)
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`, '>', 0)
        .update({
          sunday: excelRow.sunday,
          monday: excelRow.monday,
          tuesday: excelRow.tuesday,
          wednesday: excelRow.wednesday,
          thursday: excelRow.thursday,
          friday: excelRow.friday,
          saturday: excelRow.saturday,
          is_active: true,
          updated_by: userDetails.id,
          updated_at: trx.raw("NOW()")
        });

      totalUpdatedProducts += updatedCount || 0;
    }

    // ----------------------------------------------------
    // STEP 6 — Fetch Supplier Mapping (per brand & outlet)
    // ----------------------------------------------------
    const supplierRows = await trx(OUTLET_PRODUCT_MAPPING.NAME)
      .distinct(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`
      )
      .innerJoin(
        SUPPLIER.NAME,
        `${SUPPLIER.NAME}.id`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
      )
      .whereIn(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
        brandCompanyIds
      )
      .whereIn(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        outletIdFilter
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID}`,
        company_id
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
        '>',
        0
      )
      .whereNotNull(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
        true
      )
      .where(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`,
        true
      )
      .andWhere(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`,
        0
      );


    const supplierUpdatesByBrand = {};
    for (const r of supplierRows) {
      const brandId = r[OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID];
      if (!supplierUpdatesByBrand[brandId]) supplierUpdatesByBrand[brandId] = new Set();
      supplierUpdatesByBrand[brandId].add(r[OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]);
    }

    // ----------------------------------------------------
    // STEP 7 — Build UPSERT Rows (multi-outlet)
    // ----------------------------------------------------
    const rowsToUpsert = [];

    for (const [brandId, supplierSet] of Object.entries(supplierUpdatesByBrand)) {
      const excelRow = normalizedRowsMap.get(Number(brandId));
      if (!excelRow) continue;

      for (const supplierId of supplierSet) {
        for (const outletId of outletIdFilter) {
          rowsToUpsert.push({
            supplier_id: supplierId,
            brand_company_id: Number(brandId),
            outlet_id: outletId,
            company_id,
            sunday: excelRow.sunday,
            monday: excelRow.monday,
            tuesday: excelRow.tuesday,
            wednesday: excelRow.wednesday,
            thursday: excelRow.thursday,
            friday: excelRow.friday,
            saturday: excelRow.saturday,
            created_by: userDetails.id,
            created_at: trx.raw("NOW()"),
            updated_by: userDetails.id,
            updated_at: trx.raw("NOW()"),
            is_active: true
          });
        }
      }
    }

    // ----------------------------------------------------
    // STEP 8 — UPSERT Supplier Order Days
    // ----------------------------------------------------
    let upsertedCount = 0;
    const batchSize = 500;

    for (let i = 0; i < rowsToUpsert.length; i += batchSize) {
      const chunk = rowsToUpsert.slice(i, i + batchSize);

      const result = await trx(OUTLET_SUPPLIER_ORDERDAYS.NAME)
        .insert(chunk)
        .onConflict(["supplier_id", "brand_company_id", "outlet_id", "company_id"])
        .merge({
          sunday: trx.raw("EXCLUDED.sunday"),
          monday: trx.raw("EXCLUDED.monday"),
          tuesday: trx.raw("EXCLUDED.tuesday"),
          wednesday: trx.raw("EXCLUDED.wednesday"),
          thursday: trx.raw("EXCLUDED.thursday"),
          friday: trx.raw("EXCLUDED.friday"),
          saturday: trx.raw("EXCLUDED.saturday"),
          updated_by: userDetails.id,
          updated_at: trx.raw("NOW()"),
          is_active: true
        })
        .returning("id");

      upsertedCount += result.length;
    }

    await trx.commit();

    return {
      updatedOutletProductMappings: totalUpdatedProducts,
      updatedSupplierOrderDays: upsertedCount,
      outletIdsApplied: outletIdFilter
    };
  }



  // async function excelSkuMapping({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {
  //     // Step 1: Upload and extract Excel data
  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h =>
  //       h.toLowerCase().trim().replace(/\s+/g, '_')
  //     );
  //     const excelData = excelColumnData.data;
  //     // console.log("excelColumns", excelColumns);
  //     // console.log("excelData", excelData);
  //     // Step 2: Define required columns
  //     const requiredColumns = ["skucode", "outletcode", "outletname", "suppliercode", "suppliername"];

  //     // Step 3: Validate required columns
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         property: "",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 4: Validate data
  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No records found in Excel.",
  //         property: "",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 5: Collect unique codes
  //     const outletCodes = [...new Set(excelData.map(r => r.OutletCode))];
  //     const supplierCodes = [...new Set(excelData.map(r => r.SupplierCode))];
  //     const skuCodes = [...new Set(excelData.map(r => r.SKUCode))];

  //     console.log("outletCodes", outletCodes);
  //     console.log("supplierCodes", supplierCodes);
  //     // Step 6: Fetch outlet IDs
  //     const outletRows = await knex(OUTLETS.NAME)
  //       .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
  //       // .where(OUTLETS.COLUMNS.BANKID, '3005')
  //       .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);
  //     // .andWhere(OUTLETS.COLUMNS.IS_ACTIVE, true);

  //     const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));

  //     console.log("outletRows", outletRows);
  //     console.log("outletMap", outletMap);

  //     const supplierRows = await knex(SUPPLIER.NAME)
  //       .select(
  //         SUPPLIER.COLUMNS.ID,
  //         SUPPLIER.COLUMNS.SUPPLIER_CODE,
  //         SUPPLIER.COLUMNS.SUPPLIER_NAME,
  //         SUPPLIER.COLUMNS.ADD1,
  //         SUPPLIER.COLUMNS.ADD2,
  //         SUPPLIER.COLUMNS.COUNTRY_ID,
  //         SUPPLIER.COLUMNS.STATE_ID,
  //         SUPPLIER.COLUMNS.CITY_ID,
  //         SUPPLIER.COLUMNS.PINCODE,
  //         SUPPLIER.COLUMNS.PHONE,
  //         SUPPLIER.COLUMNS.EMAIL,
  //         SUPPLIER.COLUMNS.ALTER_EMAIL,
  //         SUPPLIER.COLUMNS.MOBILE,
  //         SUPPLIER.COLUMNS.OP_BAL,
  //         SUPPLIER.COLUMNS.BALANCE,
  //         SUPPLIER.COLUMNS.BANK_AC_NO,
  //         SUPPLIER.COLUMNS.BANKNAME,
  //         SUPPLIER.COLUMNS.AC_NAME,
  //         SUPPLIER.COLUMNS.IFSCCODE,
  //         SUPPLIER.COLUMNS.GSTIN,
  //         SUPPLIER.COLUMNS.FSSAI,
  //         SUPPLIER.COLUMNS.PAN_NUMBER
  //       )
  //       .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
  //       .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

  //     console.log("supplierRows", supplierRows);

  //     // const supplierMap = Object.fromEntries(supplierRows.map(s => [s.supplier_code, s.id,s.supplier_name]));
  //     const supplierMap = Object.fromEntries(
  //       supplierRows.map(s => [
  //         s.supplier_code,
  //         {
  //           id: s.id,
  //           name: s.supplier_name,
  //           add1: s.add1,
  //           add2: s.add2,
  //           country_id: s.country_id,
  //           state_id: s.state_id,
  //           city_id: s.city_id,
  //           pincode: s.pincode,
  //           phone: s.phone,
  //           email: s.email,
  //           alter_email: s.alter_email,
  //           mobile: s.mobile,
  //           op_bal: s.op_bal,
  //           balance: s.balance,
  //           bank_ac_no: s.bank_ac_no,
  //           bankname: s.bankname,
  //           ac_name: s.ac_name,
  //           ifsccode: s.ifsccode,
  //           gstin: s.gstin,
  //           fssaino: s.fssaino,
  //           pan_number: s.pan_number
  //         }
  //       ])
  //     );

  //     const itemRows = await knex(ITEM.NAME)
  //       .select(
  //         ITEM.COLUMNS.ID,
  //         ITEM.COLUMNS.PRODUCT_CODE,
  //         ITEM.COLUMNS.PURCHASE_RATE,
  //         ITEM.COLUMNS.SALE_RATE,
  //         ITEM.COLUMNS.MRP,
  //         ITEM.COLUMNS.GST,
  //         ITEM.COLUMNS.CESS,
  //         ITEM.COLUMNS.OPENING_STOCK,
  //         ITEM.COLUMNS.BALANCE,
  //         ITEM.COLUMNS.HSN,
  //         ITEM.COLUMNS.MBQ,
  //         ITEM.COLUMNS.PACK_QTY,
  //         ITEM.COLUMNS.MIN_STOCK,
  //         ITEM.COLUMNS.ALLOW_NEG_STK,
  //         ITEM.COLUMNS.WSCALE,
  //         ITEM.COLUMNS.MIN_STOCK_WARNING
  //       )
  //       .whereIn(ITEM.COLUMNS.PRODUCT_CODE, skuCodes)
  //       .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

  //     // Create map for product details
  //     const itemMap = Object.fromEntries(
  //       itemRows.map(i => [i.pro_code, i]) // key: product_code, value: full item record
  //     );

  //     const suppliersToInsert = [];
  //     const outletProductToInsert = [];

  //     for (const row of excelData) {
  //       // const { SKUCode, SupplierCode, OutletCode, supplierName } = row;
  //       // const supplier_id = supplierMap[SupplierCode];

  //       // const outlet_id = outletMap[OutletCode];
  //       // const product_id = itemMap[SKUCode];

  //       // console.log("supplier_id", supplier_id);
  //       // console.log("outlet_id", outlet_id);
  //       // console.log("product_id", product_id);

  //       // // Skip missing IDs
  //       // if (!supplier_id || !outlet_id) continue;

  //       // // Supplier ↔ Outlet mapping
  //       // suppliersToInsert.push({
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE]: supplier_id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO]: supplier_id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: SupplierCode,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME]: supplierName,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //       //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
  //       // });

  //       const { SKUCode, SupplierCode, OutletCode } = row;
  //       const supplier = supplierMap[SupplierCode];
  //       const supplier_id = supplier?.id;

  //       console.log("supplier", supplier);

  //       const outlet_id = outletMap[OutletCode];
  //       // const product_id = itemMap[SKUCode];

  //       const product = itemMap[SKUCode];
  //       const product_id = product?.id;

  //       console.log("supplier_id", supplier_id);
  //       console.log("outlet_id", outlet_id);
  //       console.log("product_id", product_id);

  //       if (!supplier_id || !outlet_id) continue;
  //       suppliersToInsert.push({
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE]: supplier_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO]: supplier_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: SupplierCode,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME]: supplier.name,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1]: supplier.add1,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2]: supplier.add2,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID]: supplier.country_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID]: supplier.state_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID]: supplier.city_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE]: supplier.pincode,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE]: supplier.phone,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL]: supplier.email,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL]: supplier.alter_email,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE]: supplier.mobile,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL]: supplier.op_bal,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: supplier.balance,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO]: supplier.bank_ac_no,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME]: supplier.bankname,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME]: supplier.ac_name,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE]: supplier.ifsccode,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN]: supplier.gstin,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO]: supplier.fssaino,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER]: supplier.pan_number,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
  //       });


  //       if (product_id) {
  //         // vendorsToInsert.push({
  //         //   [OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORS_ID]: supplier_id,
  //         //   [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
  //         //   [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: SKUCode,
  //         //   [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //         //   [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //         //   [VENDORS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //         //   [VENDORS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //         //   [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: true
  //         // });

  //         outletProductToInsert.push({
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product.id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: product.pro_code,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE]: product.purchase_rate,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE]: product.sale_rate,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.MRP]: product.mrp,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.GST]: product.gst,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.CESS]: product.cess,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: product.opening_stock,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: product.balance,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.HSN]: product.hsn,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.MBQ]: product.mbq,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: product.pack_qty,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: product.min_stock,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: product.allow_neg_stk,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: product.wscale,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK]: product.min_stock_warning,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.LOCAL_OUTLET_PURCHASE]: true,
  //           [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: true
  //         });
  //       }
  //     }

  //     console.log('suppliersToInsert', suppliersToInsert)
  //     console.log('outletProductToInsert', outletProductToInsert)

  //     if (!suppliersToInsert.length && !outletProductToInsert.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No valid records found to import.",
  //         property: "",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     // Step 10: Insert supplier–outlet mapping (skip if already exists)
  //     if (suppliersToInsert.length) {
  //       // await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //       //   .insert(suppliersToInsert)
  //       //   .onConflict([
  //       //     SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
  //       //     SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE,
  //       //     SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
  //       //     SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID
  //       //   ])
  //       //   .ignore();

  //       const existingMappings = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //         .select(
  //           SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
  //           SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
  //           SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID
  //         );

  //       const existingSet = new Set(
  //         existingMappings.map(
  //           m => `${m.supplier_id}_${m.outlet_id}_${m.company_id}`
  //         )
  //       );

  //       const uniqueToInsert = suppliersToInsert.filter(
  //         m => !existingSet.has(`${m.supplier_id}_${m.outlet_id}_${m.company_id}`)
  //       );

  //       if (uniqueToInsert.length) {
  //         await trx(SUPPLIER_OUTLET_MAPPING.NAME).insert(uniqueToInsert);
  //       }

  //     }

  //     // Step 11: Insert vendors mapping (skip if already exists)
  //     // if (outletProductToInsert.length) {
  //     //   await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //     //     .insert(outletProductToInsert)
  //     //     .onConflict([
  //     //       OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
  //     //       OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
  //     //       OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
  //     //     ])
  //     //     .ignore(); // ✅ Skip existing records
  //     // }

  //     if (outletProductToInsert.length) {
  //       // Extract unique combinations
  //       const companyIds = [...new Set(outletProductToInsert.map(m => m.company_id))];
  //       const outletIds = [...new Set(outletProductToInsert.map(m => m.outlet_id))];
  //       const productIds = [...new Set(outletProductToInsert.map(m => m.pro_id))];

  //       console.log('companyIds', companyIds);
  //       console.log('outletIds', outletIds);
  //       console.log('productIds', productIds);

  //       // Step 1: Fetch existing records
  //       const existingProducts = await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //         .select(
  //           OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
  //           OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
  //           OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
  //         )
  //         .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, companyIds)
  //         .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIds)
  //         .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, productIds);

  //       console.log('existingProducts', existingProducts);

  //       // Step 2: Build a set of existing combinations
  //       const existingProductSet = new Set(
  //         existingProducts.map(
  //           p => `${p.pro_id}_${p.outlet_id}_${p.company_id}`
  //         )
  //       );

  //       // Step 3: Filter new mappings
  //       const uniqueProductToInsert = outletProductToInsert.filter(
  //         p =>
  //           !existingProductSet.has(
  //             `${p.pro_id}_${p.outlet_id}_${p.company_id}`
  //           )
  //       );

  //       console.log('uniqueProductToInsert', uniqueProductToInsert);

  //       if (uniqueProductToInsert.length) {
  //         // Step 4A: Insert new mappings
  //         await trx(OUTLET_PRODUCT_MAPPING.NAME).insert(uniqueProductToInsert);
  //         console.log(`✅ Inserted ${uniqueProductToInsert.length} new outlet–product mappings`);
  //       } else {
  //         console.log("ℹ️ Existing mappings found — updating supplier IDs individually...");

  //         // Build a lookup map: (company_outlet_product) → supplier_id
  //         const supplierUpdateMap = new Map();

  //         for (const p of outletProductToInsert) {
  //           const key = `${p.company_id}_${p.outlet_id}_${p.pro_id}`;
  //           supplierUpdateMap.set(key, p.supplier_id);
  //         }

  //         // Update each record with its correct supplier_id
  //         for (const existing of existingProducts) {
  //           const key = `${existing.company_id}_${existing.outlet_id}_${existing.pro_id}`;
  //           const newSupplierId = supplierUpdateMap.get(key);

  //           if (newSupplierId) {
  //             await trx(OUTLET_PRODUCT_MAPPING.NAME)
  //               .update({
  //                 [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: newSupplierId,
  //                 [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //                 [OUTLET_PRODUCT_MAPPING.COLUMNS.LOCAL_OUTLET_PURCHASE]: true,
  //                 [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: true
  //               })
  //               .where(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, existing.company_id)
  //               .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, existing.outlet_id)
  //               .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, existing.pro_id); // ✅ fixed here
  //           }
  //         }

  //         console.log(`🔄 Updated supplier_id for ${supplierUpdateMap.size} existing outlet–product mappings`);
  //       }


  //     }



  //     await trx.commit();
  //     console.log("Transaction completed successfully!");
  //     return { success: true };
  //   } catch (error) {
  //     await trx.rollback();
  //     console.error("Transaction Failed:", error);

  //     if (error._code === 404 || error._code === 400) throw error;

  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Import failed.",
  //       property: "",
  //       code: "EXCEL_IMPORT_FAILED"
  //     });
  //   }
  // }

  async function excelSkuMapping({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      // Step 1: Upload and extract Excel data
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
      const excelColumns = excelColumnData.headers.map(h =>
        h.toLowerCase().trim().replace(/\s+/g, '_')
      );
      const excelData = excelColumnData.data;
      // console.log("excelColumns", excelColumns);
      // console.log("excelData", excelData);
      // Step 2: Define required columns
      const requiredColumns = ["skucode", "outletcode", "outletname", "suppliercode", "suppliername"];

      // Step 3: Validate required columns
      const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
      if (missingColumns.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 4: Validate data
      if (!excelData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No records found in Excel.",
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 5: Collect unique codes
      const outletCodes = [...new Set(excelData.map(r => r.OutletCode))];
      const supplierCodes = [...new Set(excelData.map(r => r.SupplierCode))];
      const skuCodes = [...new Set(excelData.map(r => r.SKUCode))];

      console.log("outletCodes", outletCodes);
      console.log("supplierCodes", supplierCodes);
      // Step 6: Fetch outlet IDs
      const outletRows = await knex(OUTLETS.NAME)
        .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
        // .where(OUTLETS.COLUMNS.BANKID, '3005')
        .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);
      // .andWhere(OUTLETS.COLUMNS.IS_ACTIVE, true);

      const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));

      console.log("outletRows", outletRows);
      console.log("outletMap", outletMap);

      const supplierRows = await knex(SUPPLIER.NAME)
        .select(
          SUPPLIER.COLUMNS.ID,
          SUPPLIER.COLUMNS.SUPPLIER_CODE,
          SUPPLIER.COLUMNS.SUPPLIER_NAME,
          SUPPLIER.COLUMNS.ADD1,
          SUPPLIER.COLUMNS.ADD2,
          SUPPLIER.COLUMNS.COUNTRY_ID,
          SUPPLIER.COLUMNS.STATE_ID,
          SUPPLIER.COLUMNS.CITY_ID,
          SUPPLIER.COLUMNS.PINCODE,
          SUPPLIER.COLUMNS.PHONE,
          SUPPLIER.COLUMNS.EMAIL,
          SUPPLIER.COLUMNS.ALTER_EMAIL,
          SUPPLIER.COLUMNS.MOBILE,
          SUPPLIER.COLUMNS.OP_BAL,
          SUPPLIER.COLUMNS.BALANCE,
          SUPPLIER.COLUMNS.BANK_AC_NO,
          SUPPLIER.COLUMNS.BANKNAME,
          SUPPLIER.COLUMNS.AC_NAME,
          SUPPLIER.COLUMNS.IFSCCODE,
          SUPPLIER.COLUMNS.GSTIN,
          SUPPLIER.COLUMNS.FSSAI,
          SUPPLIER.COLUMNS.PAN_NUMBER
        )
        .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
        .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

      console.log("supplierRows", supplierRows);

      // const supplierMap = Object.fromEntries(supplierRows.map(s => [s.supplier_code, s.id,s.supplier_name]));
      const supplierMap = Object.fromEntries(
        supplierRows.map(s => [
          s.supplier_code,
          {
            id: s.id,
            name: s.supplier_name,
            add1: s.add1,
            add2: s.add2,
            country_id: s.country_id,
            state_id: s.state_id,
            city_id: s.city_id,
            pincode: s.pincode,
            phone: s.phone,
            email: s.email,
            alter_email: s.alter_email,
            mobile: s.mobile,
            op_bal: s.op_bal,
            balance: s.balance,
            bank_ac_no: s.bank_ac_no,
            bankname: s.bankname,
            ac_name: s.ac_name,
            ifsccode: s.ifsccode,
            gstin: s.gstin,
            fssaino: s.fssaino,
            pan_number: s.pan_number
          }
        ])
      );

      const itemRows = await knex(ITEM.NAME)
        .select(
          ITEM.COLUMNS.ID,
          ITEM.COLUMNS.PRODUCT_CODE,
          ITEM.COLUMNS.PURCHASE_RATE,
          ITEM.COLUMNS.SALE_RATE,
          ITEM.COLUMNS.MRP,
          ITEM.COLUMNS.GST,
          ITEM.COLUMNS.CESS,
          ITEM.COLUMNS.OPENING_STOCK,
          ITEM.COLUMNS.BALANCE,
          ITEM.COLUMNS.HSN,
          ITEM.COLUMNS.MBQ,
          ITEM.COLUMNS.PACK_QTY,
          ITEM.COLUMNS.MIN_STOCK,
          ITEM.COLUMNS.ALLOW_NEG_STK,
          ITEM.COLUMNS.WSCALE,
          ITEM.COLUMNS.MIN_STOCK_WARNING,
          ITEM.COLUMNS.TYPEDESIGN_ID,
          ITEM.COLUMNS.OUTLET_PRODUCT_ID
        )
        .whereIn(ITEM.COLUMNS.PRODUCT_CODE, skuCodes)
        .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

      // Create map for product details
      const itemMap = Object.fromEntries(
        itemRows.map(i => [i.pro_code, i]) // key: product_code, value: full item record
      );

      const suppliersToInsert = [];
      const outletProductToInsert = [];
      const supplierOutletAdded = new Set();

      for (const row of excelData) {
        // const { SKUCode, SupplierCode, OutletCode, supplierName } = row;
        // const supplier_id = supplierMap[SupplierCode];

        // const outlet_id = outletMap[OutletCode];
        // const product_id = itemMap[SKUCode];

        // console.log("supplier_id", supplier_id);
        // console.log("outlet_id", outlet_id);
        // console.log("product_id", product_id);

        // // Skip missing IDs
        // if (!supplier_id || !outlet_id) continue;

        // // Supplier ↔ Outlet mapping
        // suppliersToInsert.push({
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE]: supplier_id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO]: supplier_id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: SupplierCode,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME]: supplierName,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
        //   [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
        // });

        const { SKUCode, SupplierCode, OutletCode } = row;
        const supplier = supplierMap[SupplierCode];
        const supplier_id = supplier?.id;

        console.log("supplier", supplier);

        const outlet_id = outletMap[OutletCode];
        // const product_id = itemMap[SKUCode];

        let product = itemMap[SKUCode];
        const product_id = product?.id;

        console.log("supplier_id", supplier_id);
        console.log("outlet_id", outlet_id);
        console.log("product_id", product_id);

        if (!supplier_id || !outlet_id) continue;

        const supplierOutletKey = `${supplier_id}_${outlet_id}`;
        if (!supplierOutletAdded.has(supplierOutletKey)) {
          supplierOutletAdded.add(supplierOutletKey);
          suppliersToInsert.push({
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE]: supplier_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO]: supplier_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: SupplierCode,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME]: supplier.name,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1]: supplier.add1,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2]: supplier.add2,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID]: supplier.country_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID]: supplier.state_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID]: supplier.city_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE]: supplier.pincode,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE]: supplier.phone,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL]: supplier.email,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL]: supplier.alter_email,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE]: supplier.mobile,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL]: supplier.op_bal,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: supplier.balance,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO]: supplier.bank_ac_no,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME]: supplier.bankname,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME]: supplier.ac_name,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE]: supplier.ifsccode,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN]: supplier.gstin,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO]: supplier.fssaino,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER]: supplier.pan_number,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
            [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
          });
        }

        if (product_id) {
          // vendorsToInsert.push({
          //   [OUTLET_PRODUCT_MAPPING.COLUMNS.VENDORS_ID]: supplier_id,
          //   [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
          //   [VENDORS_MAPPING.COLUMNS.PRODUCT_CODE]: SKUCode,
          //   [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
          //   [VENDORS_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
          //   [VENDORS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
          //   [VENDORS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
          //   [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: true
          // });

          outletProductToInsert.push({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID]: product.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: product.pro_code,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PURCHASE_RATE]: product.purchase_rate,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.SALES_RATE]: product.sale_rate,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MRP]: product.mrp,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.GST]: product.gst,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CESS]: product.cess,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK]: product.opening_stock,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK]: product.balance,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.HSN]: product.hsn,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MBQ]: product.mbq,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PACK_QTY]: product.pack_qty,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK]: product.min_stock,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK]: product.allow_neg_stk,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE]: product.wscale,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_WARN_STOCK]: product.min_stock_warning,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.LOCAL_OUTLET_PURCHASE]: true,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: true,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: product.typedesign_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID]: product.outlet_product_id
          });
        }
      }

      console.log('suppliersToInsert', suppliersToInsert)
      console.log('outletProductToInsert', outletProductToInsert)

      if (!suppliersToInsert.length && !outletProductToInsert.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No valid records found to import.",
          property: "",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // Step 10: Insert supplier–outlet mapping (skip if already exists)
      if (suppliersToInsert.length) {
        // await trx(SUPPLIER_OUTLET_MAPPING.NAME)
        //   .insert(suppliersToInsert)
        //   .onConflict([
        //     SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
        //     SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE,
        //     SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
        //     SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID
        //   ])
        //   .ignore();

        const existingMappings = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
          .select(
            SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID,
            SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID,
            SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID
          );

        const existingSet = new Set(
          existingMappings.map(
            m => `${m.supplier_id}_${m.outlet_id}_${m.company_id}`
          )
        );

        const uniqueToInsert = suppliersToInsert.filter(
          m => !existingSet.has(`${m.supplier_id}_${m.outlet_id}_${m.company_id}`)
        );

        if (uniqueToInsert.length) {
          await trx(SUPPLIER_OUTLET_MAPPING.NAME).insert(uniqueToInsert);
        }

      }

      // Step 11: Insert vendors mapping (skip if already exists)
      // if (outletProductToInsert.length) {
      //   await trx(OUTLET_PRODUCT_MAPPING.NAME)
      //     .insert(outletProductToInsert)
      //     .onConflict([
      //       OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
      //       OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
      //       OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
      //     ])
      //     .ignore(); // ✅ Skip existing records
      // }

      if (outletProductToInsert.length) {
        // Extract unique combinations
        const companyIds = [...new Set(outletProductToInsert.map(m => m.company_id))];
        const outletIds = [...new Set(outletProductToInsert.map(m => m.outlet_id))];
        const productIds = [...new Set(outletProductToInsert.map(m => m.pro_id))];

        console.log('companyIds', companyIds);
        console.log('outletIds', outletIds);
        console.log('productIds', productIds);

        // Step 1: Fetch existing records
        const existingProducts = await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .select(
            OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID,
            OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID,
            OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID
          )
          .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, companyIds)
          .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outletIds)
          .whereIn(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, productIds);

        console.log('existingProducts', existingProducts);

        // Step 2: Build a set of existing combinations
        const existingProductSet = new Set(
          existingProducts.map(
            p => `${p.pro_id}_${p.outlet_id}_${p.company_id}`
          )
        );

        // Step 3: Filter new mappings
        const uniqueProductToInsert = outletProductToInsert.filter(
          p =>
            !existingProductSet.has(
              `${p.pro_id}_${p.outlet_id}_${p.company_id}`
            )
        );

        console.log('uniqueProductToInsert', uniqueProductToInsert);

        if (uniqueProductToInsert.length) {
          // Step 4A: Insert new mappings
          await trx(OUTLET_PRODUCT_MAPPING.NAME).insert(uniqueProductToInsert);
          console.log(`✅ Inserted ${uniqueProductToInsert.length} new outlet–product mappings`);
        } else {
          console.log("ℹ️ Existing mappings found — updating supplier IDs individually...");

          // Build a lookup map: (company_outlet_product) → supplier_id
          const supplierUpdateMap = new Map();

          for (const p of outletProductToInsert) {
            const key = `${p.company_id}_${p.outlet_id}_${p.pro_id}`;
            supplierUpdateMap.set(key, p.supplier_id);
          }

          // Update each record with its correct supplier_id
          for (const existing of existingProducts) {
            const key = `${existing.company_id}_${existing.outlet_id}_${existing.pro_id}`;
            const newSupplierId = supplierUpdateMap.get(key);

            if (newSupplierId) {
              const matched = outletProductToInsert.find(
                p => p.company_id === existing.company_id &&
                  p.outlet_id === existing.outlet_id &&
                  p.pro_id === existing.pro_id
              );

              await trx(OUTLET_PRODUCT_MAPPING.NAME)
                .update({
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: matched.brand_company_id,
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID]: matched.outlet_product_id,
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: newSupplierId,
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.LOCAL_OUTLET_PURCHASE]: true,
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE]: true,
                  [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
                })
                .where(OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID, existing.company_id)
                .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, existing.outlet_id)
                .andWhere(OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_ID, existing.pro_id);

            }
          }

          console.log(`🔄 Updated supplier_id for ${supplierUpdateMap.size} existing outlet–product mappings`);
        }


      }



      await trx.commit();
      console.log("Transaction completed successfully!");
      return { success: true };
    } catch (error) {
      await trx.rollback();
      console.error("Transaction Failed:", error);

      if (error._code === 404 || error._code === 400) throw error;

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Import failed.",
        property: "",
        code: "EXCEL_IMPORT_FAILED"
      });
    }
  }


  async function getExcelSkuMapping({ logTrace, params, queryString }) {
    const knex = this;
    const { outlet_id, region_id } = params;

    const query2 = knex(ITEM.NAME)
      .select(
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as SKUCode`,
        knex.raw(`CAST(${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} AS INTEGER) AS numeric_product_code`),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID} as OutletCode`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as OutletName`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_CODE} as SupplierCode`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as SupplierName`
      )

      // JOIN: outlet_products_mapping (OPM)
      .innerJoin(OUTLET_PRODUCT_MAPPING.NAME, function () {
        this.on(
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`,
          `${ITEM.NAME}.${ITEM.COLUMNS.OUTLET_PRODUCT_ID}`
        );
      })

      // JOIN: supplier
      .innerJoin(
        SUPPLIER.NAME,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`
      )

      // CORRECTED JOIN: supplier_outlet_mapping (SOM)
      .innerJoin(SUPPLIER_OUTLET_MAPPING.NAME, function () {
        this.on(
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
          `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
        ).on(
          `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
        );
      })

      // JOIN: outlets
      .leftJoin(
        OUTLETS.NAME,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )

      // BASE WHERE
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE}`, true)
      .andWhere(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${ITEM.NAME}.${ITEM.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);


    // REGION FILTER (region selected & outlet_id = -1)
    if (Number(region_id)) {

      // Get outlets under region
      let outletIdsQuery = knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      // If specific outlet also passed → restrict to that
      if (Number(outlet_id) !== -1) {
        outletIdsQuery.andWhere(OUTLETS.COLUMNS.ID, Number(outlet_id));
      }

      const outletIds = await outletIdsQuery;

      if (outletIds.length === 0) return [];

      // Apply in main query
      // STEP 3: Apply outlet filters in supplier-outlet-mapping
      query2.whereIn(
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
        outletIds
      );

      // STEP 4: Apply outlet filters in outlet-product-mapping
      query2.whereIn(
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
        outletIds
      );
    }

    // ORDER BY
    query2.orderBy([
      { column: 'numeric_product_code', order: 'asc' }
    ]);


    logQuery({
      logger: fastify.log,
      query: query2,
      context: "Get SKU Mapping",
      logTrace
    });

    const response = await query2;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SKU mapping not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function removeExcelSkuMapping({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });

      const normalize = (h) => h.toLowerCase().trim().replace(/\s+/g, "_");

      const normalizedData = excelColumnData.data.map(row => {
        const newRow = {};
        for (const key in row) newRow[normalize(key)] = row[key];
        return newRow;
      });

      if (!normalizedData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No records found in Excel.",
          code: "EXCEL_REMOVE_FAILED"
        });
      }

      const required = ["skucode", "outletcode", "suppliercode"];
      const excelColumns = excelColumnData.headers.map(h => normalize(h));

      const missing = required.filter(c => !excelColumns.includes(c));
      if (missing.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns in Excel: ${missing.join(", ")}`,
          code: "EXCEL_REMOVE_FAILED"
        });
      }

      const outletCodes = [...new Set(normalizedData.map(r => r.outletcode).filter(Boolean))];
      const supplierCodes = [...new Set(normalizedData.map(r => r.suppliercode).filter(Boolean))];
      const skuCodes = [...new Set(normalizedData.map(r => r.skucode).filter(Boolean))];

      if (!outletCodes.length || !supplierCodes.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Excel missing valid OutletCode or SupplierCode.",
          code: "EXCEL_REMOVE_FAILED"
        });
      }

      const outletRows = await knex(OUTLETS.NAME)
        .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
        .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);

      const supplierRows = await knex(SUPPLIER_OUTLET_MAPPING.NAME)
        .select(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID, SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE)
        .whereIn(SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE, supplierCodes)

      const outletMap = Object.fromEntries(outletRows.map(r => [r.bankid, r.id]));
      const supplierMap = Object.fromEntries(supplierRows.map(r => [r.supplier_code, r.supplier_id]));

      const supplierOutletConditions = [];
      const vendorMappingConditions = [];

      for (const row of normalizedData) {
        const supplier_id = supplierMap[row.suppliercode];
        const outlet_id = outletMap[row.outletcode];

        if (!supplier_id || !outlet_id) continue;
        supplierOutletConditions.push({
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
          [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id
        });

        if (row.skucode) {
          vendorMappingConditions.push({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.PRODUCT_CODE]: row.skucode,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id
          });
        }
      }

      if (supplierOutletConditions.length) {

        await trx(SUPPLIER_OUTLET_MAPPING.NAME)
          .where(builder => {
            supplierOutletConditions.forEach(cond => builder.orWhere(cond));
          })
          .del();
      }

      if (vendorMappingConditions.length) {
        await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .where(builder => {
            vendorMappingConditions.forEach(cond => builder.orWhere(cond));
          })
          .del();
      }

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();
      console.error("SKU Mapping Removal Failed:", error);

      throw CustomError.create({
        httpCode: error.httpCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || "Remove mapping failed.",
        code: "EXCEL_REMOVE_FAILED"
      });
    }
  }

  // async function removeExcelSkuMapping({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {
  //     // Step 1: Upload and extract Excel data
  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h =>
  //       h.toLowerCase().trim().replace(/\s+/g, '_')
  //     );
  //     const excelData = excelColumnData.data;

  //     // Step 2: Required columns
  //     const requiredColumns = ["skucode", "outletcode", "suppliercode"];
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         property: "",
  //         code: "EXCEL_REMOVE_FAILED"
  //       });
  //     }

  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No records found in Excel.",
  //         property: "",
  //         code: "EXCEL_REMOVE_FAILED"
  //       });
  //     }

  //     // Step 3: Collect unique codes
  //     const outletCodes = [...new Set(excelData.map(r => r.OutletCode))];
  //     const supplierCodes = [...new Set(excelData.map(r => r.SupplierCode))];
  //     const skuCodes = [...new Set(excelData.map(r => r.SKUCode))];

  //     // Step 4: Fetch IDs from DB
  //     const outletRows = await knex(OUTLETS.NAME)
  //       .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
  //       .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);

  //     const supplierRows = await knex(SUPPLIER.NAME)
  //       .select(SUPPLIER.COLUMNS.ID, SUPPLIER.COLUMNS.SUPPLIER_CODE)
  //       .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
  //       .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

  //     const itemRows = await knex(ITEM.NAME)
  //       .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.PRODUCT_CODE)
  //       .whereIn(ITEM.COLUMNS.PRODUCT_CODE, skuCodes)
  //       .andWhere(ITEM.COLUMNS.IS_ACTIVE, true);

  //     const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));
  //     const supplierMap = Object.fromEntries(supplierRows.map(s => [s.supplier_code, s.id]));
  //     const itemMap = Object.fromEntries(itemRows.map(i => [i.pro_code, i.id]));

  //     // Step 5: Prepare IDs to remove
  //     const supplierOutletIdsToRemove = [];
  //     const vendorMappingIdsToRemove = [];

  //     for (const row of excelData) {
  //       const { SKUCode, SupplierCode, OutletCode } = row;
  //       const supplier_id = supplierMap[SupplierCode];
  //       const outlet_id = outletMap[OutletCode];
  //       const product_id = itemMap[SKUCode];

  //       if (!supplier_id || !outlet_id) continue;

  //       supplierOutletIdsToRemove.push({ supplier_id, outlet_id, company_id: userDetails.company_id });

  //       if (product_id) {
  //         vendorMappingIdsToRemove.push({ vendor_id: supplier_id, product_id, company_id: userDetails.company_id });
  //       }
  //     }

  //     // Step 6: Remove/deactivate supplier–outlet mappings
  //     if (supplierOutletIdsToRemove.length) {
  //       for (const entry of supplierOutletIdsToRemove) {
  //         await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //           .where({
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: entry.supplier_id,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: entry.outlet_id,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: entry.company_id
  //           })
  //           .update({
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: false,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
  //           });
  //       }
  //     }

  //     // Step 7: Remove/deactivate vendors mapping
  //     if (vendorMappingIdsToRemove.length) {
  //       for (const entry of vendorMappingIdsToRemove) {
  //         await trx(VENDORS_MAPPING.NAME)
  //           .where({
  //             [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: entry.vendor_id,
  //             [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: entry.product_id,
  //             [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: entry.company_id
  //           })
  //           .update({
  //             [VENDORS_MAPPING.COLUMNS.IS_ACTIVE]: false,
  //             [VENDORS_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //             [VENDORS_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
  //           });
  //       }
  //     }

  //     await trx.commit();
  //     console.log("Remove mapping transaction completed successfully!");
  //     return { success: true };

  //   } catch (error) {
  //     await trx.rollback();
  //     console.error("Remove mapping transaction failed:", error);
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Remove mapping failed.",
  //       property: "",
  //       code: "EXCEL_REMOVE_FAILED"
  //     });
  //   }
  // }

  // async function removeExcelSkuMapping({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {
  //     // Step 1: Upload and extract Excel data
  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h =>
  //       h.toLowerCase().trim().replace(/\s+/g, '_')
  //     );
  //     const excelData = excelColumnData.data;

  //     // Step 2: Required columns
  //     const requiredColumns = ["skucode", "outletcode", "suppliercode"];
  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         property: "",
  //         code: "EXCEL_REMOVE_FAILED"
  //       });
  //     }

  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No records found in Excel.",
  //         property: "",
  //         code: "EXCEL_REMOVE_FAILED"
  //       });
  //     }

  //     // Step 3: Collect unique codes
  //     const outletCodes = [...new Set(excelData.map(r => r.OutletCode))];
  //     const supplierCodes = [...new Set(excelData.map(r => r.SupplierCode))];
  //     const skuCodes = [...new Set(excelData.map(r => r.SKUCode))];

  //     // Step 4: Fetch IDs from DB
  //     const outletRows = await knex(OUTLETS.NAME)
  //       .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
  //       .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);

  //     const supplierRows = await knex(SUPPLIER.NAME)
  //       .select(SUPPLIER.COLUMNS.ID, SUPPLIER.COLUMNS.SUPPLIER_CODE)
  //       .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes);

  //     const itemRows = await knex(ITEM.NAME)
  //       .select(ITEM.COLUMNS.ID, ITEM.COLUMNS.PRODUCT_CODE)
  //       .whereIn(ITEM.COLUMNS.PRODUCT_CODE, skuCodes);

  //     const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));
  //     const supplierMap = Object.fromEntries(supplierRows.map(s => [s.supplier_code, s.id]));
  //     const itemMap = Object.fromEntries(itemRows.map(i => [i.pro_code, i.id]));

  //     // Step 5: Prepare IDs to delete
  //     const supplierOutletConditions = [];
  //     const vendorMappingConditions = [];

  //     for (const row of excelData) {
  //       const { SKUCode, SupplierCode, OutletCode } = row;
  //       const supplier_id = supplierMap[SupplierCode];
  //       const outlet_id = outletMap[OutletCode];
  //       const product_id = itemMap[SKUCode];

  //       if (!supplier_id || !outlet_id) continue;

  //       supplierOutletConditions.push({
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //         [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id
  //       });

  //       if (product_id) {
  //         vendorMappingConditions.push({
  //           [VENDORS_MAPPING.COLUMNS.VENDORS_ID]: supplier_id,
  //           [VENDORS_MAPPING.COLUMNS.PRODUCT_ID]: product_id,
  //           [VENDORS_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id
  //         });
  //       }
  //     }

  //     // Step 6: Delete supplier–outlet mappings
  //     for (const cond of supplierOutletConditions) {
  //       await trx(SUPPLIER_OUTLET_MAPPING.NAME).where(cond).del();
  //     }

  //     // Step 7: Delete vendors mapping
  //     for (const cond of vendorMappingConditions) {
  //       await trx(VENDORS_MAPPING.NAME).where(cond).del();
  //     }

  //     await trx.commit();
  //     console.log("Mapping removal transaction completed successfully!");
  //     return { success: true };

  //   } catch (error) {
  //     await trx.rollback();
  //     console.error("Mapping removal transaction failed:", error);
  //     throw CustomError.create({
  //       httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //       message: "Remove mapping failed.",
  //       property: "",
  //       code: "EXCEL_REMOVE_FAILED"
  //     });
  //   }
  // }

  // async function excelSupplierOuteletMapping({ body, params, logTrace, query, userDetails }) {
  //   const knex = this;
  //   const trx = await knex.transaction();
  //   const { uploadExcelData } = excelImportRepo(fastify);

  //   try {

  //     const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
  //     const excelColumns = excelColumnData.headers.map(h =>
  //       h.toLowerCase().trim().replace(/\s+/g, "_")
  //     );
  //     const excelData = excelColumnData.data;

  //     const requiredColumns = [
  //       "outletcode",
  //       "outletname",
  //       "suppliercode",
  //       "suppliername",
  //       "warehousecode",
  //       "warehousename",
  //       "warehouse_type"
  //     ];

  //     const missingColumns = requiredColumns.filter(col => !excelColumns.includes(col));
  //     if (missingColumns.length > 0) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: `Missing required columns: ${missingColumns.join(", ")}`,
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }

  //     if (!excelData.length) {
  //       throw CustomError.create({
  //         httpCode: StatusCodes.BAD_REQUEST,
  //         message: "No records found in Excel.",
  //         code: "EXCEL_IMPORT_FAILED"
  //       });
  //     }
  //     // Extract codes properly from excel
  //     const outletCodes = [...new Set(excelData.map(r => r.outletcode).filter(Boolean))];
  //     const supplierCodes = [...new Set(excelData.map(r => r.suppliercode).filter(Boolean))];
  //     const warehouseCodes = [...new Set(excelData.map(r => r.warehousecode).filter(Boolean))];

  //     // Fetch outlet rows
  //     const outletRows = await knex(OUTLETS.NAME)
  //       .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
  //       .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);

  //     const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));

  //     // Fetch warehouse rows
  //     const warehouseRows = await knex(WAREHOUSE.NAME)
  //       .select(WAREHOUSE.COLUMNS.ID, WAREHOUSE.COLUMNS.BANKID)
  //       .whereIn(WAREHOUSE.COLUMNS.BANKID, warehouseCodes);

  //     const warehouseMap = Object.fromEntries(warehouseRows.map(o => [o.bankid, o.id]));

  //     const supplierRows = await knex(SUPPLIER.NAME)
  //       .select(
  //         SUPPLIER.COLUMNS.ID,
  //         SUPPLIER.COLUMNS.SUPPLIER_CODE,
  //         SUPPLIER.COLUMNS.SUPPLIER_NAME,
  //         SUPPLIER.COLUMNS.ADD1,
  //         SUPPLIER.COLUMNS.ADD2,
  //         SUPPLIER.COLUMNS.COUNTRY_ID,
  //         SUPPLIER.COLUMNS.STATE_ID,
  //         SUPPLIER.COLUMNS.CITY_ID,
  //         SUPPLIER.COLUMNS.PINCODE,
  //         SUPPLIER.COLUMNS.PHONE,
  //         SUPPLIER.COLUMNS.EMAIL,
  //         SUPPLIER.COLUMNS.ALTER_EMAIL,
  //         SUPPLIER.COLUMNS.MOBILE,
  //         SUPPLIER.COLUMNS.OP_BAL,
  //         SUPPLIER.COLUMNS.BALANCE,
  //         SUPPLIER.COLUMNS.BANK_AC_NO,
  //         SUPPLIER.COLUMNS.BANKNAME,
  //         SUPPLIER.COLUMNS.AC_NAME,
  //         SUPPLIER.COLUMNS.IFSCCODE,
  //         SUPPLIER.COLUMNS.GSTIN,
  //         SUPPLIER.COLUMNS.FSSAI,
  //         SUPPLIER.COLUMNS.PAN_NUMBER
  //       )
  //       .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
  //       .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

  //     const supplierMap = Object.fromEntries(
  //       supplierRows.map(s => [s[SUPPLIER.COLUMNS.SUPPLIER_CODE], s])
  //     );

  //     const suppliersToInsertOutlet = [];
  //     const suppliersToInsertWarehouse = [];

  //     for (const row of excelData) {
  //       const {
  //         SupplierCode,
  //         OutletCode,
  //         WarehouseCode,
  //         warehouse_type
  //       } = row;

  //       const supplier = supplierMap[SupplierCode];
  //       if (!supplier) continue;

  //       const supplier_id = supplier[SUPPLIER.COLUMNS.ID];

  //       if (warehouse_type != supplier.warehouse_id) {
  //         throw CustomError.create({
  //           httpCode: StatusCodes.BAD_REQUEST,
  //           message: `WarehouseType mismatch for supplier ${SupplierCode}`,
  //           code: "INVALID_MAPPING_TYPE"
  //         });
  //       }

  //       if (warehouse_type = 1 && !WarehouseCode) {
  //         throw CustomError.create({
  //           httpCode: StatusCodes.BAD_REQUEST,
  //           message: `WarehouseCode missing for supplier ${SupplierCode}`,
  //           code: "EXCEL_IMPORT_FAILED"
  //         });
  //       }

  //       if (warehouse_type == 0 && !OutletCode) {
  //         throw CustomError.create({
  //           httpCode: StatusCodes.BAD_REQUEST,
  //           message: `OutletCode missing for supplier ${SupplierCode}`,
  //           code: "EXCEL_IMPORT_FAILED"
  //         });
  //       }

  //       if (warehouse_type == 0) {
  //         const outlet_id = outletMap[OutletCode];
  //         if (!outlet_id) continue;

  //         const prefix = `${supplier_id}/${outlet_id}`;

  //         suppliersToInsertOutlet.push({
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_CODE]: supplier_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.CUSTOMER_NO]: supplier_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_CODE]: prefix,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_NAME]: supplier[SUPPLIER.COLUMNS.SUPPLIER_NAME],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD1]: supplier[SUPPLIER.COLUMNS.ADD1],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.ADD2]: supplier[SUPPLIER.COLUMNS.ADD2],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.COUNTRY_ID]: supplier[SUPPLIER.COLUMNS.COUNTRY_ID],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.STATE_ID]: supplier[SUPPLIER.COLUMNS.STATE_ID],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.CITY_ID]: supplier[SUPPLIER.COLUMNS.CITY_ID],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.PINCODE]: supplier[SUPPLIER.COLUMNS.PINCODE],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.PHONE]: supplier[SUPPLIER.COLUMNS.PHONE],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.EMAIL]: supplier[SUPPLIER.COLUMNS.EMAIL],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.ALTER_EMAIL]: supplier[SUPPLIER.COLUMNS.ALTER_EMAIL],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.MOBILE]: supplier[SUPPLIER.COLUMNS.MOBILE],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.OP_BAL]: supplier[SUPPLIER.COLUMNS.OP_BAL],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.BALANCE]: supplier[SUPPLIER.COLUMNS.BALANCE],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANK_AC_NO]: supplier[SUPPLIER.COLUMNS.BANK_AC_NO],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.BANKNAME]: supplier[SUPPLIER.COLUMNS.BANKNAME],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.AC_NAME]: supplier[SUPPLIER.COLUMNS.AC_NAME],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.IFSCCODE]: supplier[SUPPLIER.COLUMNS.IFSCCODE],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.GSTIN]: supplier[SUPPLIER.COLUMNS.GSTIN],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.FSSAINO]: supplier[SUPPLIER.COLUMNS.FSSAI],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.PAN_NUMBER]: supplier[SUPPLIER.COLUMNS.PAN_NUMBER],
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now(),
  //           [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true
  //         });
  //       }

  //       console.log('suppliersToInsertOutlet', suppliersToInsertOutlet);



  //       if (warehouse_type == 1) {
  //         const warehouse_id = warehouseMap[WarehouseCode];
  //         if (!warehouse_id) continue;

  //         const prefix = `${supplier_id}/${warehouse_id}`;

  //         suppliersToInsertWarehouse.push({
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouse_id,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: userDetails.company_id,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: userDetails.id,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
  //           [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_CODE]: prefix
  //         });
  //       }
  //     }
  //     console.log('suppliersToInsertWarehouse', suppliersToInsertWarehouse);


  //     if (suppliersToInsertOutlet.length) {
  //       for (const outletRow of suppliersToInsertOutlet) {
  //         const existingOutlet = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //           .where({
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID]: outletRow[SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID],
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outletRow[SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID],
  //             [SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]: outletRow[SUPPLIER_OUTLET_MAPPING.COLUMNS.COMPANY_ID]
  //           })
  //           .first();

  //         if (existingOutlet) {
  //           await trx(SUPPLIER_OUTLET_MAPPING.NAME)
  //             .where({ [SUPPLIER_OUTLET_MAPPING.COLUMNS.ID]: existingOutlet.id })
  //             .update({
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE]: true,
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //               [SUPPLIER_OUTLET_MAPPING.COLUMNS.UPDATED_BY]: userDetails.user_id
  //             });
  //         } else {
  //           await trx(SUPPLIER_OUTLET_MAPPING.NAME).insert(outletRow);
  //         }
  //       }
  //     }

  //     if (suppliersToInsertWarehouse.length) {
  //       for (const whRow of suppliersToInsertWarehouse) {
  //         const existingWarehouse = await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME)
  //           .where({
  //             [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID]: whRow[SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.SUPPLIER_ID],
  //             [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: whRow[SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID],
  //             [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: whRow[SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]
  //           })
  //           .first();

  //         if (existingWarehouse) {
  //           await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME)
  //             .where({ [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.ID]: existingWarehouse.id })
  //             .update({
  //               [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE]: true,
  //               [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_AT]: trx.fn.now(),
  //               [SUPPLIER_WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: userDetails.user_id
  //             });
  //         } else {
  //           await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME).insert(whRow);
  //         }
  //       }
  //     }

  //     await trx.commit();
  //     return { success: true };
  //   } catch (error) {
  //     await trx.rollback();
  //     console.error("Transaction Failed:", error);
  //     throw error;
  //   }
  // }

  async function excelSupplierOuteletMapping({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });
      const excelColumns = excelColumnData.headers.map(h =>
        h.toLowerCase().trim().replace(/\s+/g, "_")
      );
      const excelData = excelColumnData.data;

      // REQUIRED COLUMNS
      const requiredColumns = [
        "outletcode",
        "outletname",
        "suppliercode",
        "suppliername",
        "warehousecode",
        "warehousename",
        "warehouse_type"
      ];

      const missing = requiredColumns.filter(c => !excelColumns.includes(c));
      if (missing.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missing.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      if (!excelData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No records found in Excel.",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      // UNIQUE CODES
      const outletCodes = [...new Set(excelData.map(r => r.outletcode).filter(Boolean))];
      const supplierCodes = [...new Set(excelData.map(r => r.suppliercode).filter(Boolean))];
      const warehouseCodes = [...new Set(excelData.map(r => r.warehousecode).filter(Boolean))];

      // FETCH OUTLETS
      const outletRows = await knex(OUTLETS.NAME)
        .select(OUTLETS.COLUMNS.ID, OUTLETS.COLUMNS.BANKID)
        .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes);

      const outletMap = Object.fromEntries(outletRows.map(o => [o.bankid, o.id]));

      console.log('outletMap', outletMap);


      // FETCH WAREHOUSES
      const warehouseRows = await knex(WAREHOUSE.NAME)
        .select(WAREHOUSE.COLUMNS.ID, WAREHOUSE.COLUMNS.BANKID)
        .whereIn(WAREHOUSE.COLUMNS.BANKID, warehouseCodes);

      const warehouseMap = Object.fromEntries(warehouseRows.map(w => [w.bank_id, w.id]));

      console.log('warehouseMap', warehouseMap);


      // FETCH SUPPLIERS
      const supplierRows = await knex(SUPPLIER.NAME)
        .select(
          SUPPLIER.COLUMNS.ID,
          SUPPLIER.COLUMNS.SUPPLIER_CODE,
          SUPPLIER.COLUMNS.SUPPLIER_NAME
        )
        .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
        .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

      const supplierMap = Object.fromEntries(
        supplierRows.map(s => [s[SUPPLIER.COLUMNS.SUPPLIER_CODE], s])
      );

      console.log('supplierMap', supplierMap);


      const suppliersToInsertOutlet = [];
      const suppliersToInsertWarehouse = [];

      // MAIN LOOP
      for (const row of excelData) {

        console.log({
          excelRow: row,
          warehouse_type_raw: row.warehouse_type,
          warehouse_type_number: Number(row.warehouse_type)
        });

        const supplierCode = row.suppliercode;
        const outletCode = row.outletcode;
        const warehouseCode = row.warehousecode;
        const warehouse_type = Number(row.warehouse_type);

        const supplier = supplierMap[supplierCode];
        if (!supplier) continue;

        const supplier_id = supplier[SUPPLIER.COLUMNS.ID];
        const supplier_code = supplier[SUPPLIER.COLUMNS.SUPPLIER_CODE];

        // VALIDATIONS
        if (warehouse_type == 1 && !warehouseCode) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `WarehouseCode missing for supplier ${supplierCode}`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }

        if (warehouse_type == 0 && (!outletCode || outletCode == "")) {
          throw CustomError.create({
            httpCode: StatusCodes.BAD_REQUEST,
            message: `OutletCode missing for supplier ${supplierCode}`,
            code: "EXCEL_IMPORT_FAILED"
          });
        }

        // ---------------------- OUTLET TYPE ----------------------
        if (warehouse_type == 0) {
          const outlet_id = outletMap[outletCode];
          if (!outlet_id) continue;

          const prefix = `${supplier_code}/${outlet_id}`;

          suppliersToInsertOutlet.push({
            supplier_id,
            outlet_id,
            supplier_code: prefix,
            supplier_name: supplier.supplier_name,
            company_id: userDetails.company_id,
            created_by: userDetails.id,
            updated_by: userDetails.id,
            is_active: true
          });
        }

        // ---------------------- WAREHOUSE TYPE ----------------------
        if (warehouse_type == 1) {

          const warehouse_id = warehouseMap[warehouseCode];

          if (!warehouse_id) continue;

          const prefix = `${supplier_code}/${warehouse_id}`;

          suppliersToInsertWarehouse.push({
            supplier_id,
            warehouse_id,
            supplier_code: prefix,
            company_id: userDetails.company_id,
            is_active: true,
            created_by: userDetails.id,
            updated_by: userDetails.id
          });
        }
      }

      console.log("Outlet Insert Array:", suppliersToInsertOutlet);
      console.log("Warehouse Insert Array:", suppliersToInsertWarehouse);

      // ---------------- INSERT OUTLET MAPPINGS ----------------
      for (const row of suppliersToInsertOutlet) {
        const exist = await trx(SUPPLIER_OUTLET_MAPPING.NAME)
          .where({
            supplier_id: row.supplier_id,
            outlet_id: row.outlet_id,
            company_id: row.company_id
          })
          .first();

        if (exist) {
          await trx(SUPPLIER_OUTLET_MAPPING.NAME)
            .where({ id: exist.id })
            .update({
              is_active: true,
              updated_at: trx.fn.now(),
              updated_by: userDetails.id
            });
        } else {
          await trx(SUPPLIER_OUTLET_MAPPING.NAME).insert(row);
        }
      }

      // ---------------- INSERT WAREHOUSE MAPPINGS ----------------
      for (const row of suppliersToInsertWarehouse) {
        const exist = await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME)
          .where({
            supplier_id: row.supplier_id,
            warehouse_id: row.warehouse_id,
            company_id: row.company_id
          })
          .first();

        if (exist) {
          await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME)
            .where({ id: exist.id })
            .update({
              is_active: true,
              updated_at: trx.fn.now(),
              updated_by: userDetails.id
            });
        } else {
          await trx(SUPPLIER_WAREHOUSE_MAPPING.NAME).insert(row);
        }
      }

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();
      console.error("Transaction Failed:", error);
      throw error;
    }
  }

  return {
    getSupplier,
    getSupplierPaginate,
    postSupplier,
    putSupplier,
    deleteSupplier,
    getSupplierInfo,
    getSupplierApprovalRepo,
    getSupplierByProducts,
    getOutletSupplierByProducts,
    getOutletSupplierByDayProducts,
    getSupplierByOutletRepo,
    postExcelSupplierRepo,
    postSupplierExcelValidation,
    getSuplierOutletMappingDetails,
    getSuplierOutletMappingOrderDaysRepo,
    updateSupplierOutletMapping,
    getSuplierDetailsExportRepo,
    getSuplierOrderDaysExportRepo,
    postSupplierOrderDaysExcelImportRepo,
    excelSkuMapping,
    getExcelSkuMapping,
    removeExcelSkuMapping,
    getSuplierOrderDaysWithBrandNameExportRepo,
    excelSupplierOuteletMapping,
    postSupplierOrderDaysExcelImportBrandBasedRepo,
    getBrandCompanyBasedSupplierOrderDaysExportRepo,
    updateSupplierOutletOrderdays
  };
}

module.exports = supplierRepo;
