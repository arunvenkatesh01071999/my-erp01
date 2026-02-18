const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ITEM } = require("../../../catalog/commons");
const { TYPEDESIGN } = require("../../../catalog/commons");
const { HEADS } = require("../../../catalog/commons");
const {
  MAIN_CATEGORY
} = require("../../../catalog/category/commons/constants");
const { SUB_CATEGORY } = require("../../../catalog/category/commons/constants");
const { UNITS } = require("../../../catalog/units/commons/constants");

function getCatgoryWiseSalesRepo(fastify) {
  async function getCatgoryWiseSales({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select(
        'head_id',
        'type_id',
        'cat_id',
        'subcat_id',
        knex.raw(`
          (SELECT SUM(rate*qty) AS amount FROM sales_details AS c, sales_master AS d
          WHERE d.id = c.sales_mst_id AND d.is_credit = 0 AND 
          c.type_id = a.type_id AND c.cat_id = a.cat_id AND c.subcat_id = a.subcat_id) AS cash`),
        knex.raw(`
          (SELECT SUM(rate*qty) AS amount FROM sales_details AS c, sales_master AS d
          WHERE d.id = c.sales_mst_id AND d.is_credit = 1 AND 
          c.type_id = a.type_id AND c.cat_id = a.cat_id AND c.subcat_id = a.subcat_id) AS credit`),
        knex.raw('SUM(rate*qty) AS sales'),
        knex.raw(`
          (SELECT SUM(rate*qty) AS purchase FROM purchase_details AS d 
          WHERE d.head_id = a.head_id AND d.type_id = a.type_id AND d.cat_id = a.cat_id AND d.subcat_id = a.subcat_id) AS purchase`)
      )
      .from('sales_details AS a')
      .innerJoin('sales_master AS b', 'b.id', '=', 'a.sales_mst_id')
      .groupBy('head_id', 'type_id', 'cat_id', 'subcat_id');

    const response = await query;



    if (!response || response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "categories not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  return {
    getCatgoryWiseSales
  };
}


module.exports = getCatgoryWiseSalesRepo;
