const postSubCategoryDetailsSyncHanlder = require("./postSubCategoryDetailsHandler");
const getSubCategoryDetailsSyncHanlder = require("./getSubCategoryDetailsHandler");
const putSubCategoryDetailsSyncHanlder = require("./putSubCategoryDetailsHandler");
const putSubCategoryStatusHanlder = require("./putStatusChangeHandler");
module.exports = {
    postSubCategoryDetailsSyncHanlder,
    getSubCategoryDetailsSyncHanlder,
    putSubCategoryDetailsSyncHanlder,
    putSubCategoryStatusHanlder
}