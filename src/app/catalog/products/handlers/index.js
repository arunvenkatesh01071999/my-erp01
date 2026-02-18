const getProductHandler = require("./getProductHandler");
const putProductHandler = require("./putProductHandler");
const postProductHandler = require("./postProductHandler");
const deleteProductHandler = require("./deleteProductHandler");
const priceByVariantsHandler = require("./priceByVariantsHandler");
const getProductDetailHandler = require("./getProductDetailHandler");
const subCategoryCountHandler = require("./subCategoryCountHandler");
const getProductBySubCategoryHandler = require("./getProductBySubCategoryHandler");
const getProductByCategoryHandler = require("./getProductByCategoryHandler");
const getProductByBrandHandler = require("./getProductByBrandHandler");

module.exports = {
  getProductHandler,
  putProductHandler,
  postProductHandler,
  deleteProductHandler,
  priceByVariantsHandler,
  getProductDetailHandler,
  subCategoryCountHandler,
  getProductBySubCategoryHandler,
  getProductByCategoryHandler,
  getProductByBrandHandler
};
