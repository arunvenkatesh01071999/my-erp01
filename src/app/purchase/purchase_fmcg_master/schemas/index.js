
const postPurchaseDetailsSchema = require("./postPurchaseDetailsSchema");
const putPurchaseDetailsSchema = require("./putPurchaseDetailsSchema");
const getPurchase = require("./getPurchaseSchema");
const getPOGrnSchema = require("./getPOGrnSchema");
const deletePurchaseMasterSchema = require("./deletePurchaseDetailsSchema");
const getPurchasenoSchema = require("./getPurchasenoSchema");
const getPurchaseByIdSchema = require("./getPurchaseByIdSchema");
const getPurchaseEditListSchema = require("./getPurchaseEditListSchema");
module.exports = {
  postPurchaseDetailsSchema,
  putPurchaseDetailsSchema,
  getPurchase,
  getPOGrnSchema,
  deletePurchaseMasterSchema,
  getPurchasenoSchema,
  getPurchaseByIdSchema,
  getPurchaseEditListSchema
};
