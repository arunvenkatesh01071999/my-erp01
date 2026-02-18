const deleteOutletPurchaseOrderProductSchema = require("./deleteOutletPurchaseOrderProductSchema");
const getOutletPoSchema = require("./getOutletPoSchema");
const getOutletPurchaseOrderApprovedListSchema = require("./getOutletPurchaseOrderApprovedListSchema");
const getOutletPurchaseOrderApprovedPonoSchema = require("./getOutletPurchaseOrderApprovedPonoSchema");
const getProductDetailsSchema = require("./getProductDetailsSchema");
const postOutletPurchaseOrderSchema = require("./postOutletPurchaseOrderSchema");
const putOutletPurchaseOrderProductsSchema = require("./putOutletPurchaseOrderProductsSchema");
const getPurchaseOrderProductSchema = require("./getPurchaseOrderProductSchema");
const getautogeneratepoSchema = require("./getautogeneratepoSchema");
const postOutletPurchaseOrderTempSchema = require("./postOutletPurchaseOrderTempSchema")
const getAutoPoBrandCompanySchema = require("./getAutoPoBrandCompanySchema");
const postOutletPurchaseOrderFinalSchema = require("./postOutletPurchaseOrderFinalSchema")
const getOutletDsdPoStatusListSchema = require("./getOutletDsdPoStatusListSchema")
const updateOutletDsdPoSendBackToFinanceSchema = require("./updateOutletDsdPoSendBackToFinanceSchema.js")
module.exports = {
  getOutletPoSchema,
  getProductDetailsSchema,
  postOutletPurchaseOrderSchema,
  getOutletPurchaseOrderApprovedListSchema,
  getOutletPurchaseOrderApprovedPonoSchema,
  putOutletPurchaseOrderProductsSchema,
  deleteOutletPurchaseOrderProductSchema,
  getPurchaseOrderProductSchema,
  getautogeneratepoSchema,
  postOutletPurchaseOrderTempSchema,
  getAutoPoBrandCompanySchema,
  postOutletPurchaseOrderFinalSchema,
  getOutletDsdPoStatusListSchema,
  updateOutletDsdPoSendBackToFinanceSchema
};
