const postPurchaseFVGrnProductSchema = require("./postPurchaseFVGrnProductSchema.js");
const postPurchaseGrnFmcgProductSchema = require("./postPurchaseGrnFmcgProductSchema.js");
const getPurchaseFVGrnProductSchema = require("./getPurchaseFVGrnProductSchema.js");
const getPurchaseOrderApprovedPonoSchema = require("./getPurchaseOrderApprovedPonoSchema.js");
const getPurchaseGrnApprovedListSchema = require("./getPurchaseGrnApprovedListSchema.js");
const putPurchaseGrnFmcgProductSchema = require("./putPurchaseGrnFmcgProductSchema.js");
const generateGrnNoSchema = require("./generateGrnNoSchema.js")
const deletePurchaseGrnFmcgProductSchema = require("./deletePurchaseGrnFmcgProductSchema.js");
const getPurchaseGrnByIdSchema = require("./getPurchaseGrnByIdSchema.js");
module.exports = {
  postPurchaseFVGrnProductSchema,
  postPurchaseGrnFmcgProductSchema,
  getPurchaseFVGrnProductSchema,
  getPurchaseOrderApprovedPonoSchema,
  putPurchaseGrnFmcgProductSchema,
  deletePurchaseGrnFmcgProductSchema,
  getPurchaseGrnApprovedListSchema,
  getPurchaseGrnByIdSchema,
  generateGrnNoSchema
};
