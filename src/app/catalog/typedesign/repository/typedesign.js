const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { TYPEDESIGN } = require("../../commons");
const { ITEM } = require("../../commons");
const { TYPE_DESIGN_LOGS } = require("../commons/constants");
const { OUTLET_PO_DETAILS } = require("../../../outlet_po/Outlet_po_auto/commons/constants");
const moment = require("moment/moment");
const { OUTLET_PO_MASTER } = require("../../../outlet_po/Outlet_po_manual/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");


function typedesignRepo(fastify) {

  async function getTypedesign({ logTrace }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).orderBy(TYPEDESIGN.COLUMNS.ID, "DESC");
    // const query = knex(TYPEDESIGN.NAME).where(TYPEDESIGN.COLUMNS.IS_ACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get TYPEDESIGN",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TYPEDESIGN not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getTypedesignCurrentday({ logTrace, params }) {
    const knex = this;
    const { region_id, outlet_id} = params;
    const currentDate = moment().format("YYYY-MM-DD");

    const query = knex(OUTLET_PO_DETAILS.NAME)
      .select(
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as type_name`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.COMPANY_ID} as company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE} as is_active`
      )
      .innerJoin(
        OUTLET_PO_MASTER.NAME,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.ID}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.OUTLET_PO_MASTER_ID}`
      )
      .innerJoin(
        OUTLETS.NAME,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
        `${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`
      )
      .innerJoin(
        TYPEDESIGN.NAME,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
        `${OUTLET_PO_DETAILS.NAME}.${OUTLET_PO_DETAILS.COLUMNS.BRAND_COMPANY_ID}`
      )
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.APPROVAL}`, 0)
      .where(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.EXPIRED}`, false)
      .whereRaw(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.PO_DATE}::date = ?`, [currentDate])
      .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true)

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
      query.whereIn(`${OUTLET_PO_MASTER.NAME}.${OUTLET_PO_MASTER.COLUMNS.OUTLET_ID}`, outletIds);
    }
      
    query.groupBy([
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`,
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.COMPANY_ID}`,
      `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`
    ])
    query.orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ASC");


    logQuery({
      logger: fastify.log,
      query,
      context: "Get TYPEDESIGN from PO Details",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Brand Company not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getTypedesignPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).orderBy(TYPEDESIGN.COLUMNS.ID, "DESC");

    const { status, search } = queryString;


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(TYPEDESIGN.COLUMNS.TYPE_NAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get TYPEDESIGN",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TYPEDESIGN not found",
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

    return response;
  }
  async function postTypedesign({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).where(
      TYPEDESIGN.COLUMNS.TYPE_NAME,
      body.type_name
    );

    const exists_response = await query;

    console.log("exists_response", exists_response);

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "TYPEDESIGN Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Get the next available ID
    const [{ max_id }] = await knex(TYPEDESIGN.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

    const query_insert = await knex(`${TYPEDESIGN.NAME}`)
      .insert({
        [TYPEDESIGN.COLUMNS.ID]: nextId,
        [TYPEDESIGN.COLUMNS.TYPE_NAME]: body.type_name,
        [TYPEDESIGN.COLUMNS.COMPANY_ID]: body.company_id,
        [TYPEDESIGN.COLUMNS.IS_ACTIVE]: body.is_active,
        [TYPEDESIGN.COLUMNS.CREATED_BY]: userDetails.id
      })
      .returning(['id']);

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Consumer",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedConsumerId = query_insert[0].id;


    // Insert log entry
    await knex(TYPE_DESIGN_LOGS.NAME).insert({
      [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: insertedConsumerId,
      [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    });


    return { success: true, insert_id: insertedConsumerId };
  }

  async function putTypedesign({ typedesign_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).where(
      TYPEDESIGN.COLUMNS.ID,
      typedesign_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "TYPEDESIGN not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${TYPEDESIGN.NAME}`)
      .where(`${TYPEDESIGN.COLUMNS.ID}`, typedesign_id)
      .update({
        [TYPEDESIGN.COLUMNS.TYPE_NAME]: body.type_name,
        [TYPEDESIGN.COLUMNS.COMPANY_ID]: body.company_id,
        [TYPEDESIGN.COLUMNS.IS_ACTIVE]: body.is_active,
        [TYPEDESIGN.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind TYPEDESIGN",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update log entry
    await knex(TYPE_DESIGN_LOGS.NAME).insert({
      [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: typedesign_id,
      [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    });

    return { success: true };
  }

  async function deleteTypedesign({ typedesign_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).where(
      TYPEDESIGN.COLUMNS.ID,
      typedesign_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "TYPEDESIGN not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(ITEM.NAME).where(
      ITEM.COLUMNS.TYPEDESIGN_ID,
      typedesign_id
    );

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Brand Company is mapped with a product and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(TYPEDESIGN.NAME)
      .where(TYPEDESIGN.COLUMNS.ID, typedesign_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete TYPEDESIGN",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TYPEDESIGN not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // Delete log entry
    await knex(TYPE_DESIGN_LOGS.NAME).insert({
      [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: typedesign_id,
      [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: exists_response[0]?.type_name
        ? String(exists_response[0].type_name).trim()
        : null // Added safety check
    });
    return { success: true };
  }
  async function getTypedesignInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(TYPEDESIGN.NAME).where(
      TYPEDESIGN.COLUMNS.ID,
      params.typedesign_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get TYPEDESIGN Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TYPEDESIGN not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandTypedesignInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(TYPEDESIGN.NAME).where(
    //   TYPEDESIGN.COLUMNS.ID,
    //   params.typedesign_id
    // );

    const query = knex
      .distinct([
        `${TYPEDESIGN.NAME}.*`,
      ])
      .from(`${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.TYPE}`
      )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.CATID}`,
        params.cat_id
      )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY}`,
        params.sub_cat_id
      )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.HEADID}`,
        params.head_id
      )


    logQuery({
      logger: fastify.log,
      query,
      context: "Get TYPEDESIGN Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TYPEDESIGN not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getTypedesign,
    postTypedesign,
    putTypedesign,
    deleteTypedesign,
    getTypedesignInfo,
    getTypedesignPaginate,
    getBrandTypedesignInfo,
    getTypedesignCurrentday
  };
}

module.exports = typedesignRepo;
