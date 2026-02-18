const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLET_LOGS, OUTLET_MAPPING } = require("../commons/constants");
const { OUTLETS, OUTLETTYPE, FRANCHISETYPE } = require("../commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { OUTLET_PRODUCT_MAPPING, WAREHOUSE, WAREHOUSE_OUTLET_MAPPING, SUPPLIER } = require("../../../catalog/commons");
const { SUPPLIER_OUTLET_MAPPING } = require("../../../catalog/supplier/commons/constants");
const { COMPANY } = require("../../../accounts/company/commons/constants");
const { REGION } = require("../../../catalog/warehouse/commons/constants")
// const { ITEM } = require("../../item/commons/constants");
const { ITEM } = require("../../../catalog/item/commons/constants");



function outletRepo(fastify) {

  async function postOutlet({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const existingquery = knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.FULLNAME, String(body.fullname).trim())
      .where(OUTLETS.COLUMNS.SHORTNAME, String(body.short_name).trim())
      .where(OUTLETS.COLUMNS.COMPANY_ID, body.company_id)

    const exists_response = await existingquery;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const existsCode = await knex(OUTLETS.NAME)
      .where({
        [OUTLETS.COLUMNS.CODE]: body.code,
      })
      .first();

    if (existsCode) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet Code Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const existingcityResponse = await knex(CITIES.NAME)
      .select("*")
      .where(CITIES.COLUMNS.ID, Number(body.city))
      .first(); // <-- important

    const { region_id } = existingcityResponse;

    // console.log("existingcityResponse:", existingcityResponse);
    // console.log("region_id:", region_id);

    const query = knex(`${OUTLETS.NAME}`)
      .returning('id')
      .insert({
        [OUTLETS.COLUMNS.CODE]: String(body.code).trim(),
        [OUTLETS.COLUMNS.SHORTNAME]: String(body.short_name).trim(),
        [OUTLETS.COLUMNS.FULLNAME]: String(body.fullname).trim(),
        [OUTLETS.COLUMNS.ADD1]: body.add1,
        [OUTLETS.COLUMNS.ADD2]: body.add2,
        [OUTLETS.COLUMNS.ADD3]: body.add3 || '',
        [OUTLETS.COLUMNS.ADD4]: body.add4 || '',
        [OUTLETS.COLUMNS.PINCODE]: body.pincode,
        [OUTLETS.COLUMNS.COUNTRY_ID]: body.country,
        [OUTLETS.COLUMNS.STATE_ID]: body.state,
        [OUTLETS.COLUMNS.CITY_ID]: body.city,
        [OUTLETS.COLUMNS.PHONE]: body.phone || '',
        [OUTLETS.COLUMNS.MOBILE]: body.mobile,
        [OUTLETS.COLUMNS.EMAIL]: body.email,
        [OUTLETS.COLUMNS.WEBSITE]: body.website,
        [OUTLETS.COLUMNS.GSTIN]: body.gstin,
        [OUTLETS.COLUMNS.FSSAI]: body.fssai,
        [OUTLETS.COLUMNS.OUTLETTYPE]: body.outlet_type,
        [OUTLETS.COLUMNS.BANKACNO]: body.bankacno,
        [OUTLETS.COLUMNS.BANKNAME]: body.bankname,
        [OUTLETS.COLUMNS.ACNAME]: body.acname,
        [OUTLETS.COLUMNS.IFSCCODE]: body.ifsccode,
        [OUTLETS.COLUMNS.COMPANY_ID]: body.company_id,
        [OUTLETS.COLUMNS.ISGST]: body.is_gst,
        [OUTLETS.COLUMNS.FRANCHISETYPE]: Number(body.franchise_type) || 0,
        [OUTLETS.COLUMNS.LIMITATION]: body.limitation,
        [OUTLETS.COLUMNS.CREDIT_LIMIT]: body.credit_limit || 0,
        [OUTLETS.COLUMNS.WALLET_BALANCE]: body.wallet_balance,
        [OUTLETS.COLUMNS.FOR_INDENT]: body.for_indent,
        [OUTLETS.COLUMNS.WAREHOUSE_ID]: body.warehouse_id,
        [OUTLETS.COLUMNS.REGION_ID]: region_id,
        [OUTLETS.COLUMNS.CREATED_BY]: created_by
      });


    logQuery({
      logger: fastify.log,
      query,
      context: "outlets",
      logTrace
    });

    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating outlets",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    const outlet_id = response[0].id;
    // Insert log entry
    await knex(OUTLET_LOGS.NAME).insert({
      [OUTLET_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [OUTLET_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OUTLET_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OUTLET_LOGS.COLUMNS.OUTLET_ID]: outlet_id,
      [OUTLET_LOGS.COLUMNS.OUTLET_NAME]: String(body.fullname).trim()
    });

    return { success: true };
  }


  async function putOutlet({ outlet_id, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const query = knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.ID, outlet_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "outlet not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(OUTLETS.NAME)
      .whereNot(OUTLETS.COLUMNS.ID, outlet_id)
      .where(OUTLETS.COLUMNS.FULLNAME, String(body.fullname).trim())

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query2 = knex(OUTLETS.NAME)
      .whereNot(OUTLETS.COLUMNS.ID, outlet_id)
      .where(OUTLETS.COLUMNS.CODE, String(body.code).trim());

    const exists_response2 = await query2;

    if (exists_response2.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet Code Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }


    const existingcityResponse = await knex(CITIES.NAME)
      .select("*")
      .where(CITIES.COLUMNS.ID, Number(body.city))
      .first(); // <-- important

    const { region_id } = existingcityResponse;

    // console.log("existingcityResponse:", existingcityResponse);
    // console.log("region_id:", region_id);

    const query_update = await knex(`${OUTLETS.NAME}`)
      .where(`${OUTLETS.COLUMNS.ID}`, outlet_id)
      .update({
        [OUTLETS.COLUMNS.CODE]: String(body.code).trim(),
        [OUTLETS.COLUMNS.SHORTNAME]: String(body.short_name).trim(),
        [OUTLETS.COLUMNS.FULLNAME]: String(body.fullname).trim(),
        [OUTLETS.COLUMNS.ADD1]: body.add1,
        [OUTLETS.COLUMNS.ADD2]: body.add2,
        [OUTLETS.COLUMNS.ADD3]: body.add3 || '',
        [OUTLETS.COLUMNS.ADD4]: body.add4 || '',
        [OUTLETS.COLUMNS.PINCODE]: body.pincode,
        [OUTLETS.COLUMNS.COUNTRY_ID]: body.country,
        [OUTLETS.COLUMNS.STATE_ID]: body.state,
        [OUTLETS.COLUMNS.CITY_ID]: body.city,
        [OUTLETS.COLUMNS.PHONE]: body.phone || '',
        [OUTLETS.COLUMNS.MOBILE]: body.mobile,
        [OUTLETS.COLUMNS.EMAIL]: body.email,
        [OUTLETS.COLUMNS.WEBSITE]: body.website,
        [OUTLETS.COLUMNS.GSTIN]: body.gstin,
        [OUTLETS.COLUMNS.FSSAI]: body.fssai,
        [OUTLETS.COLUMNS.OUTLETTYPE]: body.outlet_type,
        [OUTLETS.COLUMNS.BANKACNO]: body.bankacno,
        [OUTLETS.COLUMNS.BANKNAME]: body.bankname,
        [OUTLETS.COLUMNS.ACNAME]: body.acname,
        [OUTLETS.COLUMNS.IFSCCODE]: body.ifsccode,
        [OUTLETS.COLUMNS.COMPANY_ID]: body.company_id,
        [OUTLETS.COLUMNS.ISGST]: body.is_gst,
        [OUTLETS.COLUMNS.FRANCHISETYPE]: Number(body.franchise_type) || 0,
        [OUTLETS.COLUMNS.LIMITATION]: body.limitation,
        [OUTLETS.COLUMNS.CREDIT_LIMIT]: body.credit_limit || 0,
        [OUTLETS.COLUMNS.WALLET_BALANCE]: body.wallet_balance,
        [OUTLETS.COLUMNS.FOR_INDENT]: body.for_indent,
        [OUTLETS.COLUMNS.WAREHOUSE_ID]: body.warehuse_id,
        [OUTLETS.COLUMNS.REGION_ID]: region_id,
        [OUTLETS.COLUMNS.UPDATED_BY]: created_by
      });

    const response = await query_update;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating outlets",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update log entry
    await knex(OUTLET_LOGS.NAME).insert({
      [OUTLET_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [OUTLET_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OUTLET_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OUTLET_LOGS.COLUMNS.OUTLET_ID]: outlet_id,
      [OUTLET_LOGS.COLUMNS.OUTLET_NAME]: String(body.fullname).trim()
    });

    return { success: true };
  }

  async function deleteOutlet({ outlet_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.ID, outlet_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet not found",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(OUTLET_PRODUCT_MAPPING.NAME)
      .where(OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID, outlet_id);

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Outlet Mapped with product cannot delete the outlet",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(OUTLETS.NAME)
      .where(OUTLETS.COLUMNS.ID, outlet_id)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "delete outlet ",
      logTrace
    });
    const response = await query_delete;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(OUTLET_LOGS.NAME).insert({
      [OUTLET_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [OUTLET_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OUTLET_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OUTLET_LOGS.COLUMNS.OUTLET_ID]: outlet_id,
      [OUTLET_LOGS.COLUMNS.OUTLET_NAME]: String(exists_response[0].fullname).trim()
    });

    return { success: true };
  }

  async function getOutlet({ queryString, body, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString
    const query = knex
      .select([
        `${OUTLETS.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id',${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name',${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`,
        ),
        knex.raw(
          `jsonb_build_object('id',${STATES.NAME}.${STATES.COLUMNS.ID}, 'name',${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`,
        ),
        knex.raw(
          `jsonb_build_object('id',${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name',${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`,
        ),
        knex.raw(
          `jsonb_build_object('id',${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}, 'name',${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE}) as outlet_type_name`,
        ),
        knex.raw(
          `jsonb_build_object('id',${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.ID}, 'name',${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.FRANCHISETYPE}) as franchise_type_name`,
        ),
        knex.raw(
          `to_jsonb(${WAREHOUSE.NAME}.*) as warehouse_id`
        )
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${FRANCHISETYPE.NAME} as ${FRANCHISETYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FRANCHISETYPE}`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.COMPANY_ID}`, params.company_id)
      .orderBy(OUTLETS.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet",
      logTrace
    });
    if (search && search.length >= 1) {
      query
        .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.PHONE}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.EMAIL}`, "ilike", `%${search}%`)
        .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.WEBSITE}`, "ilike", `%${search}%`);
    }

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletInfo({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLETS.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.OUTLETTYPE} as outlet_type_name`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.FRANCHISETYPE} as franchise_type_name`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLETTYPE.NAME} as ${OUTLETTYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.OUTLETTYPE}`,
        `${OUTLETTYPE.NAME}.${OUTLETTYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${FRANCHISETYPE.NAME} as ${FRANCHISETYPE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FRANCHISETYPE}`,
        `${FRANCHISETYPE.NAME}.${FRANCHISETYPE.COLUMNS.ID}`
      )
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.COMPANY_ID}`, params.company_id)
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, params.outlet_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Role",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "outlets not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response[0];
  }

  async function getRegionwiseOutletListRepo({ params, logTrace }) {
    const knex = this;
    const { region_id } = params;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, "desc");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet list",
      logTrace
    });

    const response = await query;
    if (!response || response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Outlets not found`,
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }


  async function getOutletList({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.BANKID}`,
        'opm.opening_stock',
        'opm.balance_stock',
        'opm.min_stock',
        'opm.allow_neg_stk',
        'opm.wscale',
        'opm.outlet_purchase',
        'opm.outlet_non_saleable',
        'local_outlet_purchase'
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .leftJoin(
        knex.raw(`
          (
            SELECT DISTINCT ON (${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}) 
              ${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID} as outlet_id,
              opening_stock, balance_stock, min_stock, allow_neg_stk, wscale, 
              outlet_purchase, outlet_non_saleable,local_outlet_purchase
            FROM ${OUTLET_PRODUCT_MAPPING.NAME}
            ORDER BY ${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}, created_at DESC
          ) as opm
        `),
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        'opm.outlet_id'
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.COMPANY_ID}`, params.company_id)
      .whereNot(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY_ID}`, 3683)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getOutletListByIdRepo({ queryString, params, logTrace, userDetails }) {
    const knex = this;
    const { id } = userDetails;
    const { company_id } = userDetails;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.*`,
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
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
      )
      .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`, id)
      .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true);



    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlets Info",
      logTrace
    });
    const response = await query;

    console.log("fianlresponse", response)
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "outlets not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getOutletCityWise({ body, params, logTrace, queryString }) {
    const knex = this;
    const { warehouse } = queryString

    // Parse comma-separated warehouse IDs
    const warehouseIds = warehouse
      ? warehouse.split(",").map((id) => parseInt(id.trim(), 10)).filter(Boolean)
      : [];

    let outletIds = [];

    // 🔹 Step 1: Get Outlet IDs if warehouse filter is provided
    if (warehouseIds.length > 0) {
      const outletMappingRows = await knex
        .distinct(`${WAREHOUSE_OUTLET_MAPPING.COLUMNS.OUTLET_ID} as outlet_id`)
        .from(WAREHOUSE_OUTLET_MAPPING.NAME)
        .whereIn(WAREHOUSE_OUTLET_MAPPING.COLUMNS.WAREHOUSE_ID, warehouseIds)
        .andWhere(WAREHOUSE_OUTLET_MAPPING.COLUMNS.IS_ACTIVE, true);

      outletIds = outletMappingRows.map(row => row.outlet_id);
    }

    const query = knex
      .distinct([
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID} as city_id`,
        `${OUTLETS.NAME}.*`
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .orderBy(`${CITIES.NAME}.${CITIES.COLUMNS.NAME}`, "ASC");

    // 🔹 Step 3: Filter outlets if we have outletIds
    if (outletIds.length > 0) {
      query.whereIn(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, outletIds);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Cities",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "outlets not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getOutletListBySupplierRepo({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.CODE}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .innerJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME} as ${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
      )


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }



  async function getPurchaseOrderRegionwiseOutletListRepo({ params, logTrace }) {
    const knex = this;
    const { region_id } = params;

    const query = knex
      .distinct([
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID} as id`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_full_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME} as outlet_short_name`,
      ])
      .from(`${OUTLETS.NAME} as ${OUTLETS.NAME}`)
      .innerJoin(
        `${SUPPLIER_OUTLET_MAPPING.NAME}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.OUTLET_ID}`
      )
      .innerJoin(
        `${SUPPLIER.NAME}`,
        `${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER_OUTLET_MAPPING.NAME}.${SUPPLIER_OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      // Conditions
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_DSD}`, 0)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.APPROVAL}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.REGION_ID}`, Number(region_id))
      .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`, "asc");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet list",
      logTrace
    });

    const response = await query;
    if (!response || response.length == 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `Outlets not found`,
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    postOutlet,
    putOutlet,
    deleteOutlet,
    getOutlet,
    getOutletInfo,
    getOutletList,
    getOutletListByIdRepo,
    getOutletCityWise,
    getOutletListBySupplierRepo,
    getRegionwiseOutletListRepo,
    getPurchaseOrderRegionwiseOutletListRepo
  };
}

module.exports = outletRepo;
