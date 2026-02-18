const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MAIN_CATEGORY, MAIN_CATEGORY_LOGS } = require("../commons/constants");
const { SUB_CATEGORY } = require("../commons/constants");

// Need Catalog DB Connection

function mainCategoryRepo(fastify) {
  async function postCategories({ params, body, company_id, id, user_name, logTrace }) {
    const knex = this;

    // Check if category already exists
    const exists_response = await knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, 'ILIKE', String(body.category_name).trim())
      .first();

    if (exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Get the next available ID
    const [{ max_id }] = await knex(MAIN_CATEGORY.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely
    // Insert new category
    const query_insert = await knex(MAIN_CATEGORY.NAME)
      .insert({
        [MAIN_CATEGORY.COLUMNS.ID]: nextId,
        [MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]: String(body.category_name).trim(),
        [MAIN_CATEGORY.COLUMNS.COMPANY_ID]: company_id,
        [MAIN_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
      })
      .returning(['id']);

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedCategoryId = query_insert[0].id;
    console.log(insertedCategoryId, "values")
    // Insert log entry
    await knex(MAIN_CATEGORY_LOGS.NAME).insert({
      [MAIN_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: insertedCategoryId,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_NAME]: String(body.category_name).trim()
    });

    return { success: true, insert_id: insertedCategoryId };
  }

  async function putCategories({ category_id, company_id, id, user_name, body, logTrace }) {
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

    const query1 = knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, 'ILIKE', String(body.cateogory_name).trim())
      .whereNot(MAIN_CATEGORY.COLUMNS.ID, category_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${MAIN_CATEGORY.NAME}`)
      .where(`${MAIN_CATEGORY.COLUMNS.ID}`, category_id)
      .update({
        [MAIN_CATEGORY.COLUMNS.CATEGORY_NAME]: String(body.category_name).trim(),
        [MAIN_CATEGORY.COLUMNS.COMPANY_ID]: company_id,
        [MAIN_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    // Update log entry
    await knex(MAIN_CATEGORY_LOGS.NAME).insert({
      [MAIN_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: category_id,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_NAME]: String(body.category_name).trim()
    });


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
  async function getCategoriesPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;

    console.log(queryString, "queryString");


    const query = knex(MAIN_CATEGORY.NAME).orderBy(
      MAIN_CATEGORY.COLUMNS.ID,
      "DESC"
    );

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, "ilike", `%${search}%`);
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Categories",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    ;
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Categories not found",
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
  async function deleteCategories({ category_id, id, user_name, body, logTrace }) {
    const knex = this;

    // Check if the category exists
    const exists_response = await knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.ID, category_id);

    console.log(exists_response, "response");

    if (exists_response.length === 0) {  // Fixed condition
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Check if the category is mapped with a subcategory
    const exists_response1 = await knex(SUB_CATEGORY.NAME)
      .where(SUB_CATEGORY.COLUMNS.CATEGORY_ID, category_id);

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category is mapped with a subcategory and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Perform the delete operation
    const response = await knex(MAIN_CATEGORY.NAME)
      .where(MAIN_CATEGORY.COLUMNS.ID, category_id)
      .del();

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Categories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Insert log entry for the deletion
    await knex(MAIN_CATEGORY_LOGS.NAME).insert({
      [MAIN_CATEGORY_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_ID]: id,
      [MAIN_CATEGORY_LOGS.COLUMNS.USER_NAME]: user_name,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_ID]: category_id,
      [MAIN_CATEGORY_LOGS.COLUMNS.CATEGORY_NAME]: exists_response[0]?.category_name
        ? String(exists_response[0].category_name).trim()
        : null // Added safety check
    });

    return { success: true };
  }


  async function getCategoriesInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(MAIN_CATEGORY.NAME).where(
      MAIN_CATEGORY.COLUMNS.ID,
      params.category_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Categories Info",
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
    return response[0];
  }
  async function getHomeCategories({ category_id, logTrace }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      const query = knex(MAIN_CATEGORY.NAME)
        .where(MAIN_CATEGORY.COLUMNS.IS_ACTIVE, "1")
        .orderBy(MAIN_CATEGORY.COLUMNS.CATEGORY_NAME, "ASC");
      // const query = knex(SUB_CATEGORY.NAME)
      //   .where(SUB_CATEGORY.COLUMNS.IS_ACTIVE, true)
      //   .where(SUB_CATEGORY.COLUMNS.CATEGORY_ID, category_id)
      //   .orderBy(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, "ASC");

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const categories = await query;

      if (!categories.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const sub_category = await Promise.all(
        categories.map(async category => {
          const sub_categories = await trx(SUB_CATEGORY.NAME)
            .where(SUB_CATEGORY.COLUMNS.CATEGORY_ID, category.id)
            .where(SUB_CATEGORY.COLUMNS.IS_ACTIVE, true)
            .select(`${SUB_CATEGORY.NAME}.*`);

          return {
            ...category,
            sub_categories
          };
        })
      );

      return sub_category;
    });

    return response;
  }
  return {
    postCategories,
    putCategories,
    getCategories,
    deleteCategories,
    getCategoriesInfo,
    getCategoriesPaginate,
    getHomeCategories
  };
}

module.exports = mainCategoryRepo;
