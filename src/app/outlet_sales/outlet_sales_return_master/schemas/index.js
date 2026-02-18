const postSalesReturnMasterSchema = require("./postOutletSalesReturnMasterSchema");
const getSalesReturnMasterSchema = require("./postOutletSalesReturnMasterSchema");
const getAllOutletSalesDocnoSchema = require("./postOutletSalesReturnMasterSchema");
const getOutletSalesSchema = require("./postOutletSalesReturnMasterSchema");
const responseSchema = require("./getAllPurchase")
const updateOsmBycashBill = require("./postOutletSalesReturnMasterSchema.js");


module.exports = {
  postSalesReturnMasterSchema,
  responseSchema,
  getSalesReturnMasterSchema,
  getAllOutletSalesDocnoSchema,
  getOutletSalesSchema,
  updateOsmBycashBill

};
