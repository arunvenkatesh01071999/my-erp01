const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { PRICE } = require("../commons/constants");

// Need Catalog DB Connection
function priceRepo(fastify) {
  async function getPriceByOutletAndProdId({
    logTrace,
    input: { product_id, outlet_id }
  }) {
    const knex = this;
    const query = knex(PRICE.NAME)
      .where(PRICE.COLUMNS.PRODUCT_ID, product_id)
      .where(PRICE.COLUMNS.CID, outlet_id)
      .where(PRICE.COLUMNS.RATE, ">", 0);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Price By Outlet and Product Id",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getPricesByOutletAndProdIds({
    logTrace,
    input: { product_ids, outlet_id }
  }) {
    const knex = this;
    const query = knex(PRICE.NAME)
      .whereIn(PRICE.COLUMNS.PRODUCT_ID, product_ids)
      .where(PRICE.COLUMNS.CID, outlet_id)
      .where(PRICE.COLUMNS.RATE, ">", 0);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Price By Outlet and Product Ids",
      logTrace
    });
    const response = await query;
    if (response.length !== product_ids.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Price not found for given Product Ids",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    getPriceByOutletAndProdId,
    getPricesByOutletAndProdIds
  };
}

module.exports = priceRepo;
