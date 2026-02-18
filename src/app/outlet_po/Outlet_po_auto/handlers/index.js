const deleteOutletPurchaseOrderProductHandler = require("./deleteOutletPurchaseOrderProductHandler");
const getautogeneratepohandler = require("./getautogeneratepohandler");
const getOutletPoPonoHandler = require("./getOutletPoPonoHandler");
const getOutletPurchaseOrderApprovedItemHandler = require("./getOutletPurchaseOrderApprovedItemHandler");
const getOutletPurchaseOrderUnApprovedListHandler = require("./getOutletPurchaseOrderUnApprovedListHandler");
const getProductBySupplierHandler = require("./getProductBySupplierHandler");
const postOutletpohandler = require("./postOutletpohandler");
const putOutletPurchaseOrderProductHandler = require("./putOutletPurchaseOrderProductHandler");
const postOutletpoTemphandler = require("./postOutletpoTemphandler")
const getAutoPoBrandCompanyhandler = require("./getAutoPoBrandCompanyhandler");
const postOutletpoFinalhandler = require("./postOutletpoFinalhandler")
const getOutletDsdPoStatusListHandler = require("./getOutletDsdPoStatusListHandler.js")
const getOutletDsdPoStatusListWithEmailHandler = require("./getOutletDsdPoStatusListWithEmailHandler.js")
const updateOutletDsdPoSendBackToFinanceHandler = require("./updateOutletDsdPoSendBackToFinanceHandler.js")
module.exports = {
  getOutletPoPonoHandler,
  getProductBySupplierHandler,
  postOutletpohandler,
  getOutletPurchaseOrderUnApprovedListHandler,
  getOutletPurchaseOrderApprovedItemHandler,
  putOutletPurchaseOrderProductHandler,
  deleteOutletPurchaseOrderProductHandler,
  getautogeneratepohandler,
  postOutletpoTemphandler,
  getAutoPoBrandCompanyhandler,
  postOutletpoFinalhandler,
  getOutletDsdPoStatusListHandler,
  getOutletDsdPoStatusListWithEmailHandler,
  updateOutletDsdPoSendBackToFinanceHandler


};
