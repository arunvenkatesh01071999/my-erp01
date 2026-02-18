const generateOutletPurchaseDocnoSchema = require("./generateOutletPurchaseDocnoSchema.js")
const getOutletPurchaseSupplierListSchema = require("./getOutletPurchaseSupplierListSchema.js")
const getOutletPurchasePoListSchema = require('./getOutletPurchasePoListSchema.js')
const getOutletPurchaseItemListSchema = require('./getOutletPurchaseItemListSchema.js')
const postOutletBasedPurchaseSchema = require('./postOutletBasedPurchaseSchema.js')
const getGrnOutletListSchema = require("./getOutletPurchaseOutletListSchema.js")
const getOutletGrnByIdSchema = require('./getOutletGrnByIdSchema.js')
const postOutletPurchaseReturnSchema = require("./postOutletPurchaseReturnSchema.js")
const getOutletPurchaseDetailsSchema = require("./getOutletPurchaseDetailsSchema.js")
const getOutletPurchaseOutletListSchema = require("./getOutletPurchaseOutletListSchema.js")
const postOutletBasedManualPurchaseSchema=require("./postOutletBasedManualPurchaseSchema")
module.exports = {
  generateOutletPurchaseDocnoSchema,
  getOutletPurchaseSupplierListSchema,
  getOutletPurchasePoListSchema,
  getOutletPurchaseItemListSchema,
  postOutletBasedPurchaseSchema,
  getGrnOutletListSchema,
  getOutletGrnByIdSchema,
  postOutletPurchaseReturnSchema,
  getOutletPurchaseDetailsSchema,
  getOutletPurchaseOutletListSchema,
  postOutletBasedManualPurchaseSchema
};
