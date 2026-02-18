const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { HEADS } = require("../../commons");
const { ITEM } = require("../../commons");
const { HEADS_LOGS } = require("../commons/constants");



function headRepo(fastify) {
  async function getHead({ logTrace }) {
    const knex = this;
    const query = knex(HEADS.NAME)
    .where(HEADS.COLUMNS.IS_ACTIVE, "1")
    .orderByRaw(`COALESCE(${HEADS.COLUMNS.ID}, 0) DESC`);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get HEADS",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "HEADS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getHeadPaginate({ body,
    params,
    logTrace,
    queryString }) {
    const knex = this;

    const { status, search } = queryString;

    const query = knex(HEADS.NAME);

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${HEADS.NAME}.${HEADS.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${HEADS.NAME}.${HEADS.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(HEADS.COLUMNS.CATEOGORY_NAME, "ilike", `%${search}%`);
      });
    }

    // Order by ID (Handle null values)
    query.orderByRaw(`COALESCE(${HEADS.COLUMNS.ID}, 0) DESC`);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get HEADS",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "HEADS not found",
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
  async function postHead({ params, body, logTrace, userDetails }) {
    const knex = this;

    // Check if category name already exists
    const exists_response = await knex(HEADS.NAME)
      .where(HEADS.COLUMNS.CATEOGORY_NAME, 'ILIKE', body.cateogory_name)
      .first();

    if (exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Head Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Get the next available ID
    const [{ max_id }] = await knex(HEADS.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

    // Insert new record with manually incremented ID
    const [query_insert] = await knex(HEADS.NAME)
      .insert({
        [HEADS.COLUMNS.ID]: nextId, // ✅ Manually set the next ID
        [HEADS.COLUMNS.CATEOGORY_NAME]: body.cateogory_name,
        [HEADS.COLUMNS.COMPANY_ID]: body.company_id,
        [HEADS.COLUMNS.IS_ACTIVE]: body.is_active,
        [HEADS.COLUMNS.CREATED_BY]: userDetails.id
      })
      .returning(['id']);

    const insertedHeadsId = query_insert?.id;

    if (!insertedHeadsId) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Consumer",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Insert log entry
    await knex(HEADS_LOGS.NAME).insert({
      [HEADS_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [HEADS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [HEADS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [HEADS_LOGS.COLUMNS.HEADS_ID]: insertedHeadsId,
      [HEADS_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [HEADS_LOGS.COLUMNS.CATEGORY_NAME]: String(body.cateogory_name).trim()
    });

    return { success: true, insert_id: insertedHeadsId }; // ✅ Return next inserted ID
  }



  async function putHead({ head_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(HEADS.NAME).where(HEADS.COLUMNS.ID, head_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Head not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(HEADS.NAME)
      .where(HEADS.COLUMNS.CATEOGORY_NAME, String(body.cateogory_name).trim())
      .whereNot(HEADS.COLUMNS.ID, head_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Head Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${HEADS.NAME}`)
      .where(`${HEADS.COLUMNS.ID}`, head_id)
      .update({
        [HEADS.COLUMNS.CATEOGORY_NAME]: body.cateogory_name,
        [HEADS.COLUMNS.COMPANY_ID]: body.company_id,
        [HEADS.COLUMNS.IS_ACTIVE]: body.is_active,
        [HEADS.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind HEADS",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update log entry
    await knex(HEADS_LOGS.NAME).insert({
      [HEADS_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [HEADS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [HEADS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [HEADS_LOGS.COLUMNS.HEADS_ID]: head_id,
      [HEADS_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [HEADS_LOGS.COLUMNS.CATEGORY_NAME]: String(body.cateogory_name).trim()
    });

    return { success: true };
  }

  async function deleteHead({ head_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(HEADS.NAME).where(HEADS.COLUMNS.ID, head_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Head not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query1 = knex(ITEM.NAME).where(
      ITEM.COLUMNS.HEAD_ID,
      head_id
    );

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Brands is mapped with a product and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_delete = knex(HEADS.NAME)
      .where(HEADS.COLUMNS.ID, head_id)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "delete HEADS",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "HEADS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(HEADS_LOGS.NAME).insert({
      [HEADS_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [HEADS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [HEADS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [HEADS_LOGS.COLUMNS.HEADS_ID]: head_id,
      [HEADS_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [HEADS_LOGS.COLUMNS.CATEGORY_NAME]: exists_response[0]?.cateogory_name
        ? String(exists_response[0].cateogory_name).trim()
        : null
    });
    return { success: true };
  }
  async function getHeadInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(HEADS.NAME).where(HEADS.COLUMNS.ID, params.head_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get HEADS Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "HEADS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getHeadBrandInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .distinct([
        `${HEADS.NAME}.*`,
      ])
      .from(`${HEADS.NAME} as ${HEADS.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${HEADS.NAME}.${HEADS.COLUMNS.ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.HEAD_ID}`
      )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.MAIN_CATEGORY_ID}`,
        params.cat_id
      )
      .where(
        `${ITEM.NAME}.${ITEM.COLUMNS.SUB_CATEGORY_ID}`,
        params.sub_cat_id
      );


    logQuery({
      logger: fastify.log,
      query,
      context: "Get HEADS Info",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "HEADS or brand info not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }



  return {
    getHead,
    postHead,
    putHead,
    deleteHead,
    getHeadInfo,
    getHeadPaginate,
    getHeadBrandInfo
  };
}

module.exports = headRepo;
