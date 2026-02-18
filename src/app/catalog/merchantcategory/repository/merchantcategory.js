const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MERCHANT_CATEGORY } = require("../commons/constants")

function merchantCategoryRepo(fastify) {
  async function getMerchantCategory({ logTrace }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME)
      .orderBy(MERCHANT_CATEGORY.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Merchant Category",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Merchant Category not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getMerchantCategoryPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME).orderBy(MERCHANT_CATEGORY.COLUMNS.ID, "DESC");

    const { status, search } = queryString;


    if (Number(status) && Number(status) == 1) {
      query.where(
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.IS_ACTIVE}`,
        false
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME, "ilike", `%${search}%`);
      });
    }

    // Order by ID (Handle null values)
    query.orderByRaw(`COALESCE(${MERCHANT_CATEGORY.COLUMNS.ID}, 0) DESC`);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get MerchantCategory",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "MerchantCategory not found",
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


  async function postMerchantCategory({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME).where(
      MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME, 'ILIKE',
      body.category_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Category Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // Get the next available ID
    const [{ max_id }] = await knex(MERCHANT_CATEGORY.NAME).max("id as max_id");
    const nextId = (max_id || 0) + 1; // ✅ Get the next ID safely

    const query_insert = await knex(`${MERCHANT_CATEGORY.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [MERCHANT_CATEGORY.COLUMNS.ID]: nextId,
        [MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME]: String(body.category_name).trim(),
        [MERCHANT_CATEGORY.COLUMNS.COMPANY_ID]: body.company_id,
        [MERCHANT_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active,
        [MERCHANT_CATEGORY.COLUMNS.CREATED_BY]: userDetails.id
      });

    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating merchant category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedMerchantCategoryId = query_insert[0].id;
    console.log(insertedMerchantCategoryId, "merchant category")
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

  async function putMerchantCategory({ merchantcategory_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME).where(
      MERCHANT_CATEGORY.COLUMNS.ID,
      merchantcategory_id
    );

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Merchant Category not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(MERCHANT_CATEGORY.NAME)
      .where(MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME, 'ILIKE', String(body.category_name).trim())
      .whereNot(MERCHANT_CATEGORY.COLUMNS.ID, merchantcategory_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Merchant Category Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${MERCHANT_CATEGORY.NAME}`)
      .where(`${MERCHANT_CATEGORY.COLUMNS.ID}`, merchantcategory_id)
      .update({
        [MERCHANT_CATEGORY.COLUMNS.MERCHANT_CATEGORY_NAME]: String(body.category_name).trim(),
        [MERCHANT_CATEGORY.COLUMNS.COMPANY_ID]: body.company_id,
        [MERCHANT_CATEGORY.COLUMNS.IS_ACTIVE]: body.is_active,
        [MERCHANT_CATEGORY.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while update Merchant Category",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // // Update log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: MerchantCategory_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
    //   [TYPE_DESIGN_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_NAME]: String(body.type_name).trim()
    // });

    return { success: true };
  }

  async function deleteMerchantCategory({ merchantcategory_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME).where(
      MERCHANT_CATEGORY.COLUMNS.ID,
      merchantcategory_id
    );

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Merchant Category not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.TYPE,
    //   MerchantCategory_id
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

    const query_delete = knex(MERCHANT_CATEGORY.NAME)
      .where(MERCHANT_CATEGORY.COLUMNS.ID, merchantcategory_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Merchant Category",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Merchant Category not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // // Delete log entry
    // await knex(TYPE_DESIGN_LOGS.NAME).insert({
    //   [TYPE_DESIGN_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
    //   [TYPE_DESIGN_LOGS.COLUMNS.USER_ID]: userDetails.id,
    //   [TYPE_DESIGN_LOGS.COLUMNS.TYPE_DESIGN_ID]: MerchantCategory_id,
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
  async function getMerchantCategoryInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(MERCHANT_CATEGORY.NAME).where(
      MERCHANT_CATEGORY.COLUMNS.ID,
      params.merchantcategory_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Merchant Category Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Merchant Category not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getBrandMerchantCategoryInfo({ params, logTrace }) {
    const knex = this;


    // const query = knex(MerchantCategory.NAME).where(
    //   MerchantCategory.COLUMNS.ID,
    //   params.MerchantCategory_id
    // );

    const query = knex
      .distinct([
        `${MERCHANT_CATEGORY.NAME}.*`,
      ])
      .from(`${MERCHANT_CATEGORY.NAME} as ${MERCHANT_CATEGORY.NAME}`)
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${MERCHANT_CATEGORY.NAME}.${MERCHANT_CATEGORY.COLUMNS.ID}`,
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
      context: "Get MerchantCategory Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "MerchantCategory not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response
  }

  return {
    getMerchantCategory,
    postMerchantCategory,
    putMerchantCategory,
    deleteMerchantCategory,
    getMerchantCategoryInfo,
    getMerchantCategoryPaginate,
    getBrandMerchantCategoryInfo
  };
}

module.exports = merchantCategoryRepo;
