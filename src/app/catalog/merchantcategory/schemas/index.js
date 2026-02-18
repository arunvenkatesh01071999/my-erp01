const getMerchantCategorySchema = require("./getMerchantCategorySchema");
const postMerchantCategorySchema = require("./postMerchantCategorySchema");
const putMerchantCategorySchema = require("./putMerchantCategorySchema");
const deleteMerchantCategorySchema = require("./deleteMerchantCategorySchema");
const getMerchantCategoryInfoSchema = require("./getMerchantCategoryInfoSchema");
const getMerchantCategoryPaginateSchema = require("./getMerchantCategoryPaginateSchema");
const getTypeDesignByCategorySchema = require("./getTypeDesignByCategory");
module.exports = {
  getMerchantCategorySchema,
  postMerchantCategorySchema,
  putMerchantCategorySchema,
  deleteMerchantCategorySchema,
  getMerchantCategoryInfoSchema,
  getMerchantCategoryPaginateSchema,
  getTypeDesignByCategorySchema
};
