const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MAIN_CATEGORY } = require("../commons/constants");

// Need Catalog DB Connection

function mainCategoryRepo(fastify) {
  async function postCategories({ params, body, logTrace }) {
    const knex = this;
    const query = knex(MAIN_CATEGORY.NAME).where(
      MAIN_CATEGORY.COLUMNS.CATEGORY_NAME,
      body.category_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(`${MAIN_CATEGORY.NAME}`).insert({
      [MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]: body.category_name,
      [MAIN_CATEGORY.COLUMNS.CATEGORY_IMAGE]: body.category_image,
      [MAIN_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putCategories({ category_id, body, logTrace }) {
    const knex = this;
    const query = knex(MAIN_CATEGORY.NAME).where(
      MAIN_CATEGORY.COLUMNS.ID,
      category_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${MAIN_CATEGORY.NAME}`)
      .where(`${MAIN_CATEGORY.COLUMNS.ID}`, category_id)
      .update({
        [MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]: body.category_name,
        [MAIN_CATEGORY.COLUMNS.CATEGORY_IMAGE]: body.category_image,
        [MAIN_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function getCategories({ logTrace }) {
    const knex = this;
    const query = knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.IS_ACTIVE, "1")
      .orderBy(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, "ASC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Categories",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Categories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function deleteCategories({ category_id, body, logTrace }) {
    const knex = this;

    const query = knex(MAIN_CATEGORY.NAME).where(
      MAIN_CATEGORY.COLUMNS.ID,
      category_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.ID, category_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Categories",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Categories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  return {
    postCategories,
    putCategories,
    getCategories,
    deleteCategories
  };
}

module.exports = mainCategoryRepo;
