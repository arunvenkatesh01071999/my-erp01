const getBannersSchema = require("./getBanners");
const postBannerSchema = require("./postBannerSchema");
const putBannerSchema = require("./putBannerSchema");
const deleteBannerSchema = require("./deleteBannerSchema");
const bannerInfoSchema = require("./bannerInfoSchema");
const getBannersPaginateSchema = require("./getBannersPaginateSchema");

module.exports = {
  getBannersSchema,
  postBannerSchema,
  putBannerSchema,
  deleteBannerSchema,
  bannerInfoSchema,
  getBannersPaginateSchema
};
