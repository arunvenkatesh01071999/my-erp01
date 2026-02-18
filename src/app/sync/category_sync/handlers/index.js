const postCategoryDetailsSyncHanlder = require("./postCategoryDetailsHandler");
const getCategoryDetailsSyncHanlder = require("./getCategoryDetailsHandler");
const putCategoryDetailsSyncHanlder = require("./putCategoryDetailsHandler");
const putCategoryStatusHanlder = require("./putStatusChangeHandler");
module.exports = {
    postCategoryDetailsSyncHanlder,
    getCategoryDetailsSyncHanlder,
    putCategoryDetailsSyncHanlder,
    putCategoryStatusHanlder
}