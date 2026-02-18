
const postpurchaseHandler = require("./postPurchaseDetailsHandler");
const putPurchaseDetailsHandler = require("./putPurchaseDetailsHandler");
const getPurchaseGrnHandler = require("./getPurchaseGrnHandler");
const getPurchaseGrnListHandler = require("./getPurchaseGrnListHandler");
const getPurchaseGrnEditListHandler = require("./getPurchaseGrnEditListHandler");
const generatePurchasenoHandler = require("./generatePurchasenoHandler");
const deletePurchaseDetailsHandler = require("./deletePurchaseDetailsHandler")
const getPurchaseByIdHandler = require("./getPurchaseByIdHandler")
module.exports = {
  postpurchaseHandler,
  putPurchaseDetailsHandler,
  getPurchaseGrnHandler,
  getPurchaseGrnListHandler,
  deletePurchaseDetailsHandler,
  generatePurchasenoHandler,
  getPurchaseGrnEditListHandler,
  getPurchaseByIdHandler
};
