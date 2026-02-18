const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SUB_CATEGORY } = require("../commons/constants");

// Need Catalog DB Connection

function subCategoryRepo(fastify) {
  async function getSubCategoryById({ logTrace, input: { sub_category_id } }) {
    const knex = this;
    const query = knex(SUB_CATEGORY.NAME).where(
      SUB_CATEGORY.COLUMNS.SCAT_ID,
      sub_category_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubCategory By Id",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "sub_category_id not found in SubCategory Table",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function updateSubCategoryImageById({
    logTrace,
    input: { sub_category_id, image_url }
  }) {
    const knex = this;
    const query = knex(SUB_CATEGORY.NAME)
      .update({
        [SUB_CATEGORY.COLUMNS.SCAT_IMAGE]: image_url
      })
      .where(SUB_CATEGORY.COLUMNS.SCAT_ID, sub_category_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Update SubCategory Image By Id",
      logTrace
    });
    await query;
    return { success: true };
  }

  return {
    getSubCategoryById,
    updateSubCategoryImageById
  };
}

module.exports = subCategoryRepo;
