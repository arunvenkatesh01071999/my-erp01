const postOutletSalesReturnMasterHandler = require("./postOutletSalesReturnMasterHandler");
const getOutletsalesReturnByOutletId = require("./getOutletSalesReturnMasterHandler");
const getDocNo = require("./getSalesDocNo")
const getAllOutletSales = require("./getAllSales")
const getDocNoMaster = require("./getAllDocNo")
const getOutletSalesReturnMasterGetallHandler = require("./getOutletSalesReturnMasterGetallHandler")
// const getOutletSalesMasterHandler = require("./getOutletSalesMasterHandler");
const getOutletSalesReturnMasterGetOneHandler = require("./getOutletSalesReturnMasterGetOneHandler")

const updateOsmBycashBillHandler = require("./updateOsmBycashBillHandler.js")


module.exports = {
  postOutletSalesReturnMasterHandler,
  getOutletsalesReturnByOutletId,
  getDocNo,
  getAllOutletSales,
  getDocNoMaster,
  getOutletSalesReturnMasterGetallHandler,
  getOutletSalesReturnMasterGetOneHandler,
  updateOsmBycashBillHandler
};
