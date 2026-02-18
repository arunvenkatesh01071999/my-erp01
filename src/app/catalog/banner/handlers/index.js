const getBanners = require("./getBanners");
const putBannerHandler = require("./putBannerHandler");
const postBannerHandler = require("./postBannerHandler");
const deleteBannerHandler = require("./deleteBannerHandler");
const bannerInfoHandler = require("./bannerInfoHandler");
const getBannersPaginateHandler = require("./getBannersPaginateHandler");

module.exports = {
  getBanners,
  putBannerHandler,
  postBannerHandler,
  deleteBannerHandler,
  bannerInfoHandler,
  getBannersPaginateHandler
};
