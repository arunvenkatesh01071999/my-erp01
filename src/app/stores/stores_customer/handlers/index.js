
const postStoreCustomerHandler = require("./postStoreCustomerHandler")
const putStoreCustomerHandler = require("./putStoreCustomerHandler")
const deleteCustomerHandler = require("./deleteCustomerHandler")
const getCustomerInfoHandler = require("./getCustomerInfoHandler")
const getCustomerHandler = require("./getCustomerHandler")
const getCustomerPaginateHandler=require("./getCustomerPaginateHandler")
module.exports = {

  postStoreCustomerHandler,
  putStoreCustomerHandler,
  deleteCustomerHandler,
  getCustomerInfoHandler,
  getCustomerHandler,
  getCustomerPaginateHandler
};
