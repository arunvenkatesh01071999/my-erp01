const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { INCHARGE_MASTER } = require("../commons/constants");
const { INCHARGE_GROUP_MASTER } = require("../../inchargegroupmaster/commons/constants");

function inchargeMasterRepo(fastify) {
  async function getInchargeMaster({ logTrace }) {
    const knex = this;
    const query = knex(INCHARGE_MASTER.NAME)
      .orderBy(INCHARGE_MASTER.COLUMNS.ID, "DESC");
    // const query = knex(InchargeMaster.NAME).where(InchargeMaster.COLUMNS.IS_ACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeMaster",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getInchargeMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${INCHARGE_MASTER.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id', ${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.ID}, 'group_name', ${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME}) as incharge_group_master`
        )
      ])
      .from(`${INCHARGE_MASTER.NAME} as ${INCHARGE_MASTER.NAME}`)
      .leftJoin(
        `${INCHARGE_GROUP_MASTER.NAME} as ${INCHARGE_GROUP_MASTER.NAME}`,
        `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.INCHARGE_GROUP_ID}`,
        `${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.ID}`
      )
      .orderBy(`${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.INCHARGE_NAME}`, "ASC");

    const { status, search } = queryString;

    if (status === "1") {
      query.where(`${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.IS_ACTIVE}`, true);
    } else if (status === "2") {
      query.where(`${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.IS_ACTIVE}`, false);
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(`${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.INCHARGE_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME}`, "ilike", `%${search}%`);
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeMaster",
      logTrace: logTrace
    });

    if (params.current_page <= 0 || params.page_size <= 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Invalid pagination parameters",
        code: "BAD_REQUEST"
      });
    }

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
    });

    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeMaster not found",
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
    console.log(response, "response")

    return response;
  }


  async function postInchargeMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_MASTER.NAME).where(
      INCHARGE_MASTER.COLUMNS.INCHARGE_NAME,
      body.incharge_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Group Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${INCHARGE_MASTER.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [INCHARGE_MASTER.COLUMNS.INCHARGE_NAME]: String(body.incharge_name).trim(),
        [INCHARGE_MASTER.COLUMNS.INCHARGE_GROUP_ID]: body.incharge_group_id,
        [INCHARGE_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [INCHARGE_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [INCHARGE_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating incharge master",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedGroupMasterId = query_insert[0].id;
    console.log(insertedGroupMasterId, "group master")
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

  async function putInchargeMaster({ inchargemaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_MASTER.NAME).where(
      INCHARGE_MASTER.COLUMNS.ID,
      inchargemaster_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "InchargeMaster not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${INCHARGE_MASTER.NAME}`)
      .where(`${INCHARGE_MASTER.COLUMNS.ID}`, inchargemaster_id)
      .update({
        [INCHARGE_MASTER.COLUMNS.INCHARGE_NAME]: String(body.incharge_name).trim(),
        [INCHARGE_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [INCHARGE_MASTER.COLUMNS.INCHARGE_GROUP_ID]: body.incharge_group_id,
        [INCHARGE_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [INCHARGE_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update InchargeMaster",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // // Update log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: InchargeMaster_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });

    return { success: true };
  }

  async function deleteInchargeMaster({ inchargemaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_MASTER.NAME).where(
      INCHARGE_MASTER.COLUMNS.ID,
      inchargemaster_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "InchargeMaster not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.TYPE,
    //   InchargeMaster_id
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

    const query_delete = knex(INCHARGE_MASTER.NAME)
      .where(INCHARGE_MASTER.COLUMNS.ID, inchargemaster_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete InchargeMaster",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // // Delete log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: InchargeMaster_id,
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
  async function getInchargeMasterInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(INCHARGE_MASTER.NAME).where(
      INCHARGE_MASTER.COLUMNS.ID,
      params.inchargemaster_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandInchargeMasterInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(InchargeMaster.NAME).where(
    //   InchargeMaster.COLUMNS.ID,
    //   params.InchargeMaster_id
    // );

    const query = knex
      .distinct([
        `${INCHARGE_MASTER.NAME}.*`,
      ])
      .from(`${INCHARGE_MASTER.NAME} as ${INCHARGE_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${INCHARGE_MASTER.NAME}.${INCHARGE_MASTER.COLUMNS.ID}`,
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
      context: "Get InchargeMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getInchargeMaster,
    postInchargeMaster,
    putInchargeMaster,
    deleteInchargeMaster,
    getInchargeMasterInfo,
    getInchargeMasterPaginate,
    getBrandInchargeMasterInfo
  };
}

module.exports = inchargeMasterRepo;
