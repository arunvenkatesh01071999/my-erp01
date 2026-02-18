const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errorHandler");
const { logQuery } = require("../../commons/helpers");
const { OUTLET_CLOSING_STOCKS_TEMP } = require("../commons/constants");
const { UNITS } = require("../../catalog/units/commons/constants")
const { OUTLET_PRODUCT_MAPPING, ITEM } = require("../../catalog/commons")


function ClosingStockRepo(fastify) {

  async function postOutletClosingStocksTempRepo({ params, body, logTrace, userDetails }) {
    const knex = this;

    const outlet_closing_stock_Temp_data = {
      docdate: body.docdate,
      prodid: body.prodid,
      physical_qty: body.physical_qty,
      computer_qty: body.computer_qty,
      purchase_rate: body.purchase_rate,
      sales_rate: body.sales_rate,
      mrp: body.mrp,
      company_id: body.company_id,
      outlet_id: body.outlet_id
    }

    function getCurrentDate() {
      return new Date().toISOString().split('T')[0];
    }
    const today = getCurrentDate();
    console.log(today,"today");
    

    const outletClosingStockTempQuery = knex(OUTLET_CLOSING_STOCKS_TEMP.NAME)
      .where({
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID]: outlet_closing_stock_Temp_data.outlet_id,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID]: outlet_closing_stock_Temp_data.prodid
      })
      .first();

    const stockExistInTemp = await outletClosingStockTempQuery;

    if (!stockExistInTemp) {
      await knex(`${OUTLET_CLOSING_STOCKS_TEMP.NAME}`).insert({
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.DOCDATE]: outlet_closing_stock_Temp_data.docdate,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID]: outlet_closing_stock_Temp_data.prodid,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PHYSICAL_QTY]: Number(outlet_closing_stock_Temp_data.physical_qty) || 0,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.COMPUTER_QTY]: Number(outlet_closing_stock_Temp_data.computer_qty) || 0,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PURCHASE_RATE]: Number(outlet_closing_stock_Temp_data.purchase_rate) || 0,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.SALES_RATE]: Number(outlet_closing_stock_Temp_data.sales_rate) || 0,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.MRP]: Number(outlet_closing_stock_Temp_data.mrp) || 0,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.COMPANY_ID]: outlet_closing_stock_Temp_data.company_id || 1,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID]: outlet_closing_stock_Temp_data.outlet_id,
        [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.CREATED_BY]: userDetails?.id || 1
      });
    }
    else {

      await knex(`${OUTLET_CLOSING_STOCKS_TEMP.NAME}`)
        .update({
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PHYSICAL_QTY]: Number(outlet_closing_stock_Temp_data.physical_qty) || 0,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.COMPUTER_QTY]: Number(outlet_closing_stock_Temp_data.computer_qty) || 0,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PURCHASE_RATE]: Number(outlet_closing_stock_Temp_data.purchase_rate) || 0,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.SALES_RATE]: Number(outlet_closing_stock_Temp_data.sales_rate) || 0,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.MRP]: Number(outlet_closing_stock_Temp_data.mrp) || 0,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.COMPANY_ID]: outlet_closing_stock_Temp_data.company_id || 1,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID]: outlet_closing_stock_Temp_data.outlet_id,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.UPDATED_BY]: userDetails?.id || 1
        })
        .where({
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID]: outlet_closing_stock_Temp_data.outlet_id,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID]: outlet_closing_stock_Temp_data.prodid
        })

    }

    return { success: true };

  }

  async function getOutletClosingStocksTempRepo({ params, userDetails }) {
    const knex = this;
    const { outlet_id } = params;

    const outletClosingStocks = await knex(OUTLET_CLOSING_STOCKS_TEMP.NAME)
      .distinct([
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.ID}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.DOCDATE}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PHYSICAL_QTY}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.COMPUTER_QTY}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PURCHASE_RATE}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.SALES_RATE}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.MRP}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`
      ])
      .leftJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.ID}`
      )
      .leftJoin(OUTLET_PRODUCT_MAPPING.NAME, function () {
        this.on(
          `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.PRODID}`,
          '=',
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PRODUCT_ID}`
        ).andOn(
          `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID}`,
          '=',
          `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`
        );
      })
      .leftJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(
        `${OUTLET_CLOSING_STOCKS_TEMP.NAME}.${OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID}`,
        outlet_id
      )

    if (!outletClosingStocks.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: `No Closing Stock Temp found for outlet ${outlet_id}`,
        code: "NOT_FOUND"
      });
    }

    return outletClosingStocks;
  }

  async function deleteOutletClosingStocksTempRepo({ params }) {
    const knex = this;
    const { id, outlet_id } = params;

    const trx = await knex.transaction();

    try {

      const master = await trx(OUTLET_CLOSING_STOCKS_TEMP.NAME)
        .where({
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.ID]: id,
          [OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID]: outlet_id,
        })
        .first();

      if (!master) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: `Closign stock Temp ${id} data not found`,
          code: "NOT_FOUND"
        });
      }

      await trx(OUTLET_CLOSING_STOCKS_TEMP.NAME)
        .where(OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.ID, master?.id)
        .andWhere(OUTLET_CLOSING_STOCKS_TEMP.COLUMNS.OUTLET_ID, outlet_id)
        .del();

      await trx.commit();

      return {
        success: true,
        message: `Closign stock Temp product ${master?.prodid} deleted successfully`
      };

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
  return {
    postOutletClosingStocksTempRepo,
    getOutletClosingStocksTempRepo,
    deleteOutletClosingStocksTempRepo
  };
}


module.exports = ClosingStockRepo;
