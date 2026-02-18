const postSalesMasterHandler = require("./postSalesMasterHandler");
const putSalesHandler = require("./putSalesHandler");
const getSalesEditListHandler = require("./getSalesEditListHandler");
const deleteSalesMasterHandler = require("./deleteSalesMasterHandler");
const getSalesByIdHandler = require("./getSalesByIdHandler");
const getCustomerMappingHandler = require("./getCustomerMappingHandler");
const getCustomerDetailsHandler = require("./getCustomerDetailsHandler");
const getProductDetailsHandler = require("./getProductDetailsHandler");
const generateSaleNoHandler = require("./generateSalenoHandler");
const getExportPendingListHandler = require("./getExportPendingListHandler");
const putExportPendingListHandler = require("./putExportPendingListHandler");

module.exports = {
  postSalesMasterHandler,
  putSalesHandler,
  deleteSalesMasterHandler,
  getSalesEditListHandler,
  getSalesByIdHandler,
  getCustomerMappingHandler,
  getCustomerDetailsHandler,
  getProductDetailsHandler,
  generateSaleNoHandler,
  getExportPendingListHandler,
  putExportPendingListHandler
};
