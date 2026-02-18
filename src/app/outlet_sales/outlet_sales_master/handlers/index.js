const postOutletSalesMasterHandler = require("./postOutletSalesMasterHandler");
const getOutletSalesMasterHandler = require("./getOutletSalesMasterHandler");
const getOutletSalesDocNo = require("./getSalesDocNo")
const getAllOutletSales = require("./getAllOutletSales")

const getFetchOutletMembersHandler = require("./getFetchOutletMembersHandler")
const putOutletSalesPaymentHandler = require("./putOutletSalesPaymentHandler")
const deleteOutletSales = require("./deleteOutletSales.js")

module.exports = {
  postOutletSalesMasterHandler,
  getOutletSalesMasterHandler,
  getOutletSalesDocNo,
  getAllOutletSales,
  getFetchOutletMembersHandler,
  putOutletSalesPaymentHandler,
  deleteOutletSales
};
