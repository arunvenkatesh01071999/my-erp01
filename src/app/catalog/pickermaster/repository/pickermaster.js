const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const crypto = require("crypto");
const { logQuery } = require("../../../commons/helpers");
const { PICKER_MASTER } = require("../commons/constants")

function pickerMasterRepo(fastify) {
  async function getPickerMaster({ logTrace }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME)
      .orderBy(PICKER_MASTER.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get PickerMaster",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PickerMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPickerMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME)
      .orderBy(PICKER_MASTER.COLUMNS.ID, "DESC");

    const { status, search } = queryString;


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${PICKER_MASTER.NAME}.${PICKER_MASTER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${PICKER_MASTER.NAME}.${PICKER_MASTER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(PICKER_MASTER.COLUMNS.PICKER_NAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get PickerMaster",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PickerMaster not found",
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


  async function postPickerMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME).where(
      PICKER_MASTER.COLUMNS.PICKER_NAME,
      body.picker_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Picker Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Hash the user password with SHA-256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");


    const query_insert = await knex(`${PICKER_MASTER.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [PICKER_MASTER.COLUMNS.PICKER_NAME]: String(body.picker_name).trim(),
        [PICKER_MASTER.COLUMNS.PASSWORD]: hashedPassword,
        [PICKER_MASTER.COLUMNS.TODAY_WORK_STATUS]: body.today_work_status,
        [PICKER_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [PICKER_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [PICKER_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating picker master",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedPickerMasterId = query_insert[0].id;
    console.log(insertedPickerMasterId, "group master")
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

  async function putPickerMaster({ pickermaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME).where(
      PICKER_MASTER.COLUMNS.ID,
      pickermaster_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PickerMaster not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(PICKER_MASTER.NAME)
      .where(PICKER_MASTER.COLUMNS.PICKER_NAME, body.picker_name);

    if (pickermaster_id) {
      query1.whereNot(PICKER_MASTER.COLUMNS.ID, pickermaster_id);
    }

    const exists_response1 = await query1.first(); // ✅ Fetch only one record

    if (exists_response1) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Picker Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }


    // Hash the user password with SHA-256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");

    const query_update = await knex(`${PICKER_MASTER.NAME}`)
      .where(`${PICKER_MASTER.COLUMNS.ID}`, pickermaster_id)
      .update({
        [PICKER_MASTER.COLUMNS.PICKER_NAME]: String(body.picker_name).trim(),
        [PICKER_MASTER.COLUMNS.PASSWORD]: hashedPassword,
        [PICKER_MASTER.COLUMNS.TODAY_WORK_STATUS]: body.TODAY_WORK_STATUS,
        [PICKER_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [PICKER_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [PICKER_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update PickerMaster",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // // Update log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: PickerMaster_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });

    return { success: true };
  }

  async function deletePickerMaster({ pickermaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME).where(
      PICKER_MASTER.COLUMNS.ID,
      pickermaster_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PickerMaster not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.TYPE,
    //   PickerMaster_id
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

    const query_delete = knex(PICKER_MASTER.NAME)
      .where(PICKER_MASTER.COLUMNS.ID, pickermaster_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete PickerMaster",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PickerMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // // Delete log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: PickerMaster_id,
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

  async function getPickerMasterInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(PICKER_MASTER.NAME).where(
      PICKER_MASTER.COLUMNS.ID,
      params.pickermaster_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get PickerMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PickerMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandPickerMasterInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(PickerMaster.NAME).where(
    //   PickerMaster.COLUMNS.ID,
    //   params.PickerMaster_id
    // );

    const query = knex
      .distinct([
        `${PICKER_MASTER.NAME}.*`,
      ])
      .from(`${PICKER_MASTER.NAME} as ${PICKER_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${PICKER_MASTER.NAME}.${PICKER_MASTER.COLUMNS.ID}`,
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
      context: "Get PickerMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PickerMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getPickerMaster,
    postPickerMaster,
    putPickerMaster,
    deletePickerMaster,
    getPickerMasterInfo,
    getPickerMasterPaginate,
    getBrandPickerMasterInfo
  };
}

module.exports = pickerMasterRepo;
