const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { INCHARGE_GROUP_MASTER } = require("../commons/constants")

function InchargeGroupMasterRepo(fastify) {
  async function getInchargeGroupMaster({ logTrace }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME)
      .orderBy(INCHARGE_GROUP_MASTER.COLUMNS.ID, "DESC");
    // const query = knex(InchargeGroupMaster.NAME).where(InchargeGroupMaster.COLUMNS.IS_ACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeGroupMaster",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeGroupMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getInchargeGroupMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME).orderBy(INCHARGE_GROUP_MASTER.COLUMNS.ID, "DESC");

    const { status, search } = queryString;


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeGroupMaster",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeGroupMaster not found",
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


  async function postInchargeGroupMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME).where(
      INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME,
      body.group_name
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

    const query_insert = await knex(`${INCHARGE_GROUP_MASTER.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME]: String(body.group_name).trim(),
        [INCHARGE_GROUP_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [INCHARGE_GROUP_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [INCHARGE_GROUP_MASTER.COLUMNS.CREATED_BY]: userDetails.id
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating incharge group master",
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

  async function putInchargeGroupMaster({ inchargegroupmaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME).where(
      INCHARGE_GROUP_MASTER.COLUMNS.ID,
      inchargegroupmaster_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "InchargeGroupMaster not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${INCHARGE_GROUP_MASTER.NAME}`)
      .where(`${INCHARGE_GROUP_MASTER.COLUMNS.ID}`, inchargegroupmaster_id)
      .update({
        [INCHARGE_GROUP_MASTER.COLUMNS.GROUP_NAME]: String(body.group_name).trim(),
        [INCHARGE_GROUP_MASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [INCHARGE_GROUP_MASTER.COLUMNS.IS_ACTIVE]: body.is_active,
        [INCHARGE_GROUP_MASTER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update InchargeGroupMaster",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // // Update log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: InchargeGroupMaster_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });

    return { success: true };
  }

  async function deleteInchargeGroupMaster({ inchargegroupmaster_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME).where(
      INCHARGE_GROUP_MASTER.COLUMNS.ID,
      inchargegroupmaster_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "InchargeGroupMaster not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.TYPE,
    //   InchargeGroupMaster_id
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

    const query_delete = knex(INCHARGE_GROUP_MASTER.NAME)
      .where(INCHARGE_GROUP_MASTER.COLUMNS.ID, inchargegroupmaster_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete InchargeGroupMaster",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeGroupMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // // Delete log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: InchargeGroupMaster_id,
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
  async function getInchargeGroupMasterInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(INCHARGE_GROUP_MASTER.NAME).where(
      INCHARGE_GROUP_MASTER.COLUMNS.ID,
      params.inchargegroupmaster_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get InchargeGroupMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeGroupMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandInchargeGroupMasterInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(InchargeGroupMaster.NAME).where(
    //   InchargeGroupMaster.COLUMNS.ID,
    //   params.InchargeGroupMaster_id
    // );

    const query = knex
      .distinct([
        `${INCHARGE_GROUP_MASTER.NAME}.*`,
      ])
      .from(`${INCHARGE_GROUP_MASTER.NAME} as ${INCHARGE_GROUP_MASTER.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${INCHARGE_GROUP_MASTER.NAME}.${INCHARGE_GROUP_MASTER.COLUMNS.ID}`,
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
      context: "Get InchargeGroupMaster Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "InchargeGroupMaster not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getInchargeGroupMaster,
    postInchargeGroupMaster,
    putInchargeGroupMaster,
    deleteInchargeGroupMaster,
    getInchargeGroupMasterInfo,
    getInchargeGroupMasterPaginate,
    getBrandInchargeGroupMasterInfo
  };
}

module.exports = InchargeGroupMasterRepo;
