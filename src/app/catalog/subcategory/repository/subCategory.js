const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SUB_CATEGORY, ITEM, SUB_CATEGORY_LOGS } = require("../commons/constants");
const { MAIN_CATEGORY } = require("../commons/constants");


// Need Catalog DB Connection

function subCategoryRepo(fastify) {
  async function postSubCategories({ params, body, company_id, id, user_name, logTrace }) {
    const knex = this;
    const query = knex(SUB_CATEGORY.NAME).where(
      SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, 'ILIKE',
      String(body.subcategory_name).trim()
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(MAIN_CATEGORY.NAME).where(
      MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, 'ILIKE',
      String(body.subcategory_name).trim()
    );

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory name cannot be same as Main Category name",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    // Get the next available ID
    const [{ max_id }] = await knex(SUB_CATEGORY.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

    const query_insert = await knex(`${SUB_CATEGORY.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [SUB_CATEGORY.COLUMNS.ID]: nextId,
        [SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME]: String(body.subcategory_name).trim(),
        [SUB_CATEGORY.COLUMNS.CATEGORY_ID]: body.category_id,
        [SUB_CATEGORY.COLUMNS.COMPANY_ID]: company_id,
        [SUB_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating sub category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedSubCategoryId = query_insert[0].id;

    // Insert log entry
    await knex(SUB_CATEGORY_LOGS.NAME).insert({
      [SUB_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [SUB_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [SUB_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [SUB_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: Number(body.category_id),
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_ID]: insertedSubCategoryId,
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_NAME]: String(body.subcategory_name).trim()
    });


    return { success: true, insert_id: insertedSubCategoryId };
  }
  async function putSubCategories({ subcategory_id, id, user_name, company_id, body, logTrace }) {
    const knex = this;
    const query = knex(SUB_CATEGORY.NAME).where(
      SUB_CATEGORY.COLUMNS.ID,
      subcategory_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(SUB_CATEGORY.NAME)
      .where(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, 'ILIKE', String(body.subcategory_name).trim())
      .whereNot(SUB_CATEGORY.COLUMNS.ID, subcategory_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SUB_CATEGORY.NAME}`)
      .where(`${SUB_CATEGORY.COLUMNS.ID}`, subcategory_id)
      .update({
        [SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME]: String(body.subcategory_name).trim(),
        [SUB_CATEGORY.COLUMNS.CATEGORY_ID]: body.category_id,
        [SUB_CATEGORY.COLUMNS.COMPANY_ID]: company_id,
        [SUB_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Subcategory",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    // Update log entry
    await knex(SUB_CATEGORY_LOGS.NAME).insert({
      [SUB_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [SUB_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [SUB_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [SUB_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: Number(body.category_id),
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_ID]: subcategory_id,
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_NAME]: String(body.subcategory_name).trim()
    });


    return { success: true };
  }
  async function getSubCategoriesPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${SUB_CATEGORY.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id', ${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}, 'category_name', ${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}) as category`
        )
      ])
      .from(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )

      .orderBy(SUB_CATEGORY.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, "ilike", `%${search}%`)
          .orWhere(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategories",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
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
  async function getSubCategories({ logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${SUB_CATEGORY.NAME}.*`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`
      ])
      .from(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .where(`${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, "ASC");
    // const query = knex(SUB_CATEGORY.NAME)
    //   .where(SUB_CATEGORY.COLUMNS.IS_ACTIVE, "1")
    //   .orderBy(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, "ASC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategories",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function deleteSubCategories({ subcategory_id, id, user_name, body, logTrace }) {
    const knex = this;

    const query = knex(SUB_CATEGORY.NAME).where(
      SUB_CATEGORY.COLUMNS.ID,
      subcategory_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(ITEM.NAME).where(
      ITEM.COLUMNS.SUB_CATEGORY_ID,
      subcategory_id
    );

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubCategory is mapped with a product and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(SUB_CATEGORY.NAME)
      .where(SUB_CATEGORY.COLUMNS.ID, subcategory_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete SubCategories",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // Update log entry
    await knex(SUB_CATEGORY_LOGS.NAME).insert({
      [SUB_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [SUB_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [SUB_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [SUB_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: exists_response[0]?.category_id
        ? Number(exists_response[0].category_id)
        : null,// Added safety check
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_ID]: subcategory_id,
      [SUB_CATEGORY_LOGS.COLUMNS.SUBCATEGORY_NAME]: exists_response[0]?.subcategory_name
        ? String(exists_response[0].subcategory_name).trim()
        : null // Added safety check
    });
    return { success: true };
  }
  async function getSubCategoriesInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUB_CATEGORY.NAME}.*`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`
      ])
      .from(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .where(
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`,
        params.subcategory_id
      );
    // const query = knex(SUB_CATEGORY.NAME).where(
    //   SUB_CATEGORY.COLUMNS.ID,
    //   params.subcategory_id
    // );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategories Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }
  async function getCategorySubCategoriesInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${SUB_CATEGORY.NAME}.*`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`
      ])
      .from(`${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`)
      .leftJoin(
        `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
      )
      .where(
        `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.CATEGORY_ID}`,
        params.category_id
      );
    // const query = knex(SUB_CATEGORY.NAME).where(
    //   SUB_CATEGORY.COLUMNS.ID,
    //   params.subcategory_id
    // );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategories Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubCategories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  return {
    postSubCategories,
    putSubCategories,
    getSubCategories,
    deleteSubCategories,
    getSubCategoriesInfo,
    getSubCategoriesPaginate,
    getCategorySubCategoriesInfo
  };
}

module.exports = subCategoryRepo;
