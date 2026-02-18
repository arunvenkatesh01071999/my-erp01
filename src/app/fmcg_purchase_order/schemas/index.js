const getPurchaseOrderProductSchema = require("./getPurchaseOrderProductSchema.js");
const postPurchaseOrderProductSchema = require("./postPurchaseOrderProductSchema.js")
const getUnApprovedPurchaseOrderProductSchema = require("./getUnApprovedPurchaseOrderProductSchema.js")
const putUnApprovedPoProductSchema = require("./putUnApprovedPoProductSchema.js")
const putPoSettingSchema = require("./putPoSettingSchema.js")
const getPurchaseOrderPonoSchema = require("./getPurchaseOrderPonoSchema.js")
const getPurchaseOrderApprovedPonoSchema = require("./getPurchaseOrderApprovedPonoSchema.js")
const getPurchaseOrderPonoListSchema = require("./getPurchaseOrderPonoListSchema.js")
const getProductExpiryBySuppierSchema = require("./getProductExpiryBySuppierSchema.js")
const deletePurchaseOrderSchema = require("./deletePurchaseOrderProductSchema.js")
const putPurchaseOrderProductsSchema = require("./putPurchaseOrderProductsSchema.js")
const getPurchaseOrderApprovedListSchema = require("./getPurchaseOrderApprovedListSchema.js")
module.exports = {
  getPurchaseOrderProductSchema,
  postPurchaseOrderProductSchema,
  getUnApprovedPurchaseOrderProductSchema,
  putUnApprovedPoProductSchema,
  putPoSettingSchema,
  getPurchaseOrderPonoSchema,
  getPurchaseOrderApprovedPonoSchema,
  getPurchaseOrderPonoListSchema,
  getProductExpiryBySuppierSchema,
  deletePurchaseOrderSchema,
  putPurchaseOrderProductsSchema,
  getPurchaseOrderApprovedListSchema
};
