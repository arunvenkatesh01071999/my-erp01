const postSubAccountsHandler = require("./postSubAccountsHandler");
const putSubAccountsHandler = require("./putSubAccountsHandler");
const getSubAccountsHandler = require("./getSubAccountsHandler");
const deleteSubAccountsHandler = require("./deleteSubAccountsHandler");
const getSubAccountsInfoHandler = require("./getSubAccountsInfoHandler");
const getSubAccountsPaginateHandler = require("./getSubAccountsPaginateHandler");
const getSubAccountsByAccHandler = require("./getSubAccountsByAccHandler");

module.exports = {
  postSubAccountsHandler,
  putSubAccountsHandler,
  getSubAccountsHandler,
  deleteSubAccountsHandler,
  getSubAccountsInfoHandler,
  getSubAccountsPaginateHandler,
  getSubAccountsByAccHandler
};
