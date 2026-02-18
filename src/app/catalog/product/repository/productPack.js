const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PRODUCT_PACK, PACK_UNIT_MASTER } = require("../commons/constants");

// Need Catalog DB Connection

function productPackRepo(fastify) {
  async function getPackInfoByProdAndPackId({
    logTrace,
    input: { product_id, pack_id }
  }) {
    const knex = this;
    const query = knex
      .select(["PP.*", "PUM.*"])
      .from(`${PRODUCT_PACK.NAME} as PP`)
      .leftJoin(
        `${PACK_UNIT_MASTER.NAME} as PUM`,
        `PP.${PRODUCT_PACK.COLUMNS.PACK_ID}`,
        `PUM.${PACK_UNIT_MASTER.COLUMNS.PACK_ID}`
      )
      .where(`PP.${PRODUCT_PACK.COLUMNS.PACK_ID}`, pack_id)
      .where(`PP.${PRODUCT_PACK.COLUMNS.PRODUCT_ID}`, product_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pack Info By Product And Pack Id",
      logTrace
    });
    const response = await query;
    // if (!response.length) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "PackInfo not found",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }
    return response[0];
  }

  async function getPackInfoByProdIdsAndPackIds({
    logTrace,
    input: { product_to_pack_ids }
  }) {
    const knex = this;
    const { PRODUCT_ID, PACK_ID } = PRODUCT_PACK.COLUMNS;
    const { WEIGHT } = PACK_UNIT_MASTER.COLUMNS;
    const query = knex
      .select([`PP.${PRODUCT_ID}`, `PP.${PACK_ID}`, `PUM.${WEIGHT}`])
      .from(`${PRODUCT_PACK.NAME} as PP`)
      .leftJoin(
        `${PACK_UNIT_MASTER.NAME} as PUM`,
        `PP.${PRODUCT_PACK.COLUMNS.PACK_ID}`,
        `PUM.${PACK_UNIT_MASTER.COLUMNS.PACK_ID}`
      )
      .whereRaw(
        `concat(PP.${PRODUCT_PACK.COLUMNS.PRODUCT_ID}, '_',PP.${
          PRODUCT_PACK.COLUMNS.PACK_ID
        }) in ('${product_to_pack_ids.join("','")}')`
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pack Info By ProductIds And Pack Ids",
      logTrace
    });
    const response = await query;
    // if (response.length !== product_to_pack_ids.length) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_FOUND,
    //     message: "PackInfo not found For Given Products",
    //     property: "",
    //     code: "NOT_FOUND"
    //   });
    // }
    return response;
  }

  async function getPackInfoByPackIds({ logTrace, input: { pack_ids } }) {
    const knex = this;
    const query = knex
      .select([
        PACK_UNIT_MASTER.COLUMNS.PACK_ID,
        PACK_UNIT_MASTER.COLUMNS.WEIGHT
      ])
      .from(PACK_UNIT_MASTER.NAME)
      .whereIn(PACK_UNIT_MASTER.COLUMNS.PACK_ID, pack_ids);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Pack Info By Pack Ids",
      logTrace
    });
    const response = await query;
    if (response.length !== pack_ids.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PackInfo not found For Given PackIds",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  return {
    getPackInfoByProdAndPackId,
    getPackInfoByProdIdsAndPackIds,
    getPackInfoByPackIds
  };
}

module.exports = productPackRepo;
