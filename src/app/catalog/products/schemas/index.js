const getProductSchema = require("./getProductSchema");
const postProductSchema = require("./postProductSchema");
const putProductSchema = require("./putProductSchema");
const deleteProductSchema = require("./deleteProductSchema");
const getProductDetailSchema = require("./getProductDetailSchema");
const subCategoryCountSchema = require("./subCategoryCountSchema");
const getProductBySubCategorySchema = require("./getProductBySubCategorySchema");
const getProductByCategorySchema = require("./getProductByCategorySchema");
const getProductByBrandSchema = require("./getProductByBrandSchema");

module.exports = {
  getProductSchema,
  postProductSchema,
  putProductSchema,
  deleteProductSchema,
  getProductDetailSchema,
  subCategoryCountSchema,
  getProductBySubCategorySchema,
  getProductByCategorySchema,
  getProductByBrandSchema
};
