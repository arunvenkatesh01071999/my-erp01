const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { TRAY_MASTER } = require("../commons/constants")

function trayMasterRepo(fastify) {
  async function getTrayMaster({ logTrace }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME)
      .orderBy(TRAY_MASTER.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get TrayMaster",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TrayMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getTrayMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME)
      .orderBy(TRAY_MASTER.COLUMNS.ID, "DESC");

    const { status, search } = queryString;


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(TRAY_MASTER.COLUMNS.TRAY_NAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get TrayMaster",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TrayMaster not found",
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


  async function postTrayMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME).where(
      TRAY_MASTER.COLUMNS.TRAY_NAME,
      body.tray_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Tray Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Get the next available ID
    const [{ max_id }] = await knex(TRAY_MASTER.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

    const query_insert = await knex(`${TRAY_MASTER.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [TRAY_MASTER.COLUMNS.ID]: nextId,
        [TRAY_MASTER.COLUMNS.TRAY_NAME]: String(body.tray_name).trim(),
        [TRAY_MASTER.COLUMNS.TRAY_WEIGHT]: body.tray_weight,
        [TRAY_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [TRAY_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [TRAY_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating tray master",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedTrayMasterId = query_insert[0].id;
    console.log(insertedTrayMasterId, "group master")
    // // Insert log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: insertedConsumerId,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });


    return { success: true };
  }

  async function putTrayMaster({ traymaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME).where(
      TRAY_MASTER.COLUMNS.ID,
      traymaster_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "TrayMaster not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }


    const query1 = knex(TRAY_MASTER.NAME)
      .where(TRAY_MASTER.COLUMNS.TRAY_NAME, body.tray_name);

    if (traymaster_id) {
      query1.whereNot(TRAY_MASTER.COLUMNS.ID, traymaster_id);
    }

    const exists_response1 = await query1.first(); // ✅ Fetch only one record

    if (exists_response1) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Tray Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    const query_update = await knex(`${TRAY_MASTER.NAME}`)
      .where(`${TRAY_MASTER.COLUMNS.ID}`, traymaster_id)
      .update({
        [TRAY_MASTER.COLUMNS.TRAY_NAME]: String(body.tray_name).trim(),
        [TRAY_MASTER.COLUMNS.TRAY_WEIGHT]: body.tray_weight,
        [TRAY_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [TRAY_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [TRAY_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update TrayMaster",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // // Update log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: traymaster_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });

    return { success: true };
  }

  async function deleteTrayMaster({ traymaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME).where(
      TRAY_MASTER.COLUMNS.ID,
      traymaster_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "TrayMaster not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.TYPE,
    //   traymaster_id
    // );

    // const exists_response1 = await query1;

    // if (exists_response1.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "Brand Company is mapped with a product and cannot be deleted",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    const query_delete = knex(TRAY_MASTER.NAME)
      .where(TRAY_MASTER.COLUMNS.ID, traymaster_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete TrayMaster",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TrayMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // // Delete log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: traymaster_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
    //     ? String(exists_response[0].company_id).trim()
    //     : null,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: exists_response[0]?.type_name
    //     ? String(exists_response[0].type_name).trim()
    //     : null // Added safety check
    // });
    return { success: true };
  }
  async function getTrayMasterInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(TRAY_MASTER.NAME).where(
      TRAY_MASTER.COLUMNS.ID,
      params.traymaster_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get TrayMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TrayMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandTrayMasterInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(TrayMaster.NAME).where(
    //   TrayMaster.COLUMNS.ID,
    //   params.traymaster_id
    // );

    const query = knex
      .distinct([
        `${TRAY_MASTER.NAME}.*`,
      ])
      .from(`${TRAY_MASTER.NAME} as ${TRAY_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${TRAY_MASTER.NAME}.${TRAY_MASTER.COLUMNS.ID}`,
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
      context: "Get TrayMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "TrayMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getTrayMaster,
    postTrayMaster,
    putTrayMaster,
    deleteTrayMaster,
    getTrayMasterInfo,
    getTrayMasterPaginate,
    getBrandTrayMasterInfo
  };
}

module.exports = trayMasterRepo;
