const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLET_SALES_EDIT_LOG } = require("../../commons");



function getClosingCashMstRepo(fastify) {

  async function postOutletSalesEditLog({ params, body, logTrace, userDetails }) {
    const knex = this;

    const outlet_sales_edit_log_insert = await knex(`${OUTLET_SALES_EDIT_LOG.NAME}`).insert
      ({
        [OUTLET_SALES_EDIT_LOG.COLUMNS.BARCODE]: body.barcode,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.PRO_ID]: body.pro_id,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.OUTLET_ID]: body.outlet_id,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.PRO_NAME]: body.pro_name,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.SALES_MAN_ID]: body.sales_man_id,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.SALES_MAN_NAME]: body.sales_man_name,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.BILL_NO]: body.bill_no,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.MRP]: body.mrp,
        [OUTLET_SALES_EDIT_LOG.COLUMNS.QTY]: body.qty,

      });

    return { success: true };
  }

  return {
    postOutletSalesEditLog
  };
}

module.exports = getClosingCashMstRepo;
