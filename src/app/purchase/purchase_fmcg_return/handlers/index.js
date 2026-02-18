const postpurchaseReturnHandler = require("./postpurchaseReturnHandler.js");
const putpurchaseReturnHandler = require("./putPurchaseReturnHandler.js");
const deletePurchaseReturnHandler = require("./deletePurchaseReturnHandler.js");
const getPurchaseReturnDetailsHandler = require("./getPurchaseReturnDetailsHandler.js");
const getPurchaseReturnEditListHandler = require("./getPurchaseReturnEditListHandler.js");
const getPurchaseReturnByIdHandler = require("./getPurchaseReturnByIdHandler.js");
const getPurchaseReturn = require("./getPurchaseDocNo")
const getPurchaseDocNoHandler = require("./getAllPurchase")
const getPurchaseReturnGetAllHandler = require("./getPurchaseReturnGetAllHandler.js")
const generatePurchaseReturnNoHandler = require("./generatePurchaseReturnNoHandler.js")
const getPurchaseReturnBySupplierHanlder = require("./getPurchaseReturnBySupplierHanlder.js")
const getPurchaseReturnListHandler = require("./getPurchaseReturnListHandler.js")
const getPurchaseBillwiseDetailsHandler = require("./getPurchaseBillwiseDetailsHandler.js")
const getPurchaseNoDetailsHandler = require("./getPurchaseNoDetailsHandler.js")
module.exports = {
  postpurchaseReturnHandler,
  deletePurchaseReturnHandler,
  putpurchaseReturnHandler,
  getPurchaseReturnDetailsHandler,
  getPurchaseReturn,
  getPurchaseDocNoHandler,
  getPurchaseReturnGetAllHandler,
  generatePurchaseReturnNoHandler,
  getPurchaseReturnBySupplierHanlder,
  getPurchaseReturnListHandler,
  getPurchaseBillwiseDetailsHandler,
  getPurchaseNoDetailsHandler,
  getPurchaseReturnEditListHandler,
  getPurchaseReturnByIdHandler
};
