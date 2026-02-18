const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PRODUCT } = require("../commons/constants");

// Need Catalog DB Connection

function productRepo(fastify) {
  async function getProductById({ logTrace, input: { product_id } }) {
    const knex = this;
    const query = knex(PRODUCT.NAME).where(
      PRODUCT.COLUMNS.PRODUCT_ID,
      product_id
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product By Id",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "product_id not found in Product Table",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getProductByCode({ logTrace, input: { product_code } }) {
    const knex = this;
    const query = knex(PRODUCT.NAME).where(
      PRODUCT.COLUMNS.PROD_CODE,
      product_code
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product By Code",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "product_code not found in Product Table",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function updateProductImageById({
    logTrace,
    input: { product_id, image_url }
  }) {
    const knex = this;
    const query = knex(PRODUCT.NAME)
      .update({
        [PRODUCT.COLUMNS.IMG_PATH1]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH2]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH3]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH4]: image_url
      })
      .where(PRODUCT.COLUMNS.PRODUCT_ID, product_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Update Product Image By Id",
      logTrace
    });
    await query;
    return { success: true };
  }

  async function updateProductImageByCode({
    logTrace,
    input: { product_code, image_url }
  }) {
    const knex = this;
    const query = knex(PRODUCT.NAME)
      .update({
        [PRODUCT.COLUMNS.IMG_PATH1]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH2]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH3]: image_url,
        [PRODUCT.COLUMNS.IMG_PATH4]: image_url
      })
      .where(PRODUCT.COLUMNS.PROD_CODE, product_code);
    logQuery({
      logger: fastify.log,
      query,
      context: "Update Product Image By Code",
      logTrace
    });
    await query;
    return { success: true };
  }

  async function getProductByIds({ logTrace, input: { product_ids } }) {
    const knex = this;
    const query = knex(PRODUCT.NAME).whereIn(
      PRODUCT.COLUMNS.PRODUCT_ID,
      product_ids
    );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product By Ids",
      logTrace
    });
    const response = await query;
    if (response.length !== product_ids.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "All product_ids not found in Product Table",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getOutletInfoOfProductByIds({
    logTrace,
    input: { product_ids }
  }) {
    const knex = this;
    const query = knex(PRODUCT.NAME)
      .select([PRODUCT.COLUMNS.PRODUCT_ID, PRODUCT.COLUMNS.OUTLET])
      .whereIn(PRODUCT.COLUMNS.PRODUCT_ID, product_ids);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Outlet Info Of Product By Id",
      logTrace
    });
    const response = await query;
    if (response.length !== product_ids.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "All product_ids not found in Product Table",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    getProductById,
    getProductByIds,
    getOutletInfoOfProductByIds,
    updateProductImageById,
    getProductByCode,
    updateProductImageByCode
  };
}

module.exports = productRepo;
