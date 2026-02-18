const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { BANNER } = require("../commons/constants");

function bannerRepo(fastify) {
  async function getBanners({ logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME).where(BANNER.COLUMNS.ISACTIVE, "1");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Banner",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "banners not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getBannersPaginate({ params, logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Banner",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "banners not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return response;
  }
  async function postBanner({ params, body, logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME).where(
      BANNER.COLUMNS.BANNERNAME,
      body.banner_name
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Banner Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(`${BANNER.NAME}`).insert({
      [BANNER.COLUMNS.BANNERNAME]: body.banner_name,
      [BANNER.COLUMNS.BANNERIMAGEURL]: body.banner_image_url,
      [BANNER.COLUMNS.ISACTIVE]: body.is_active
    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Banner",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putBanner({ banner_id, body, logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME).where(BANNER.COLUMNS.ID, banner_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Banner not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${BANNER.NAME}`)
      .where(`${BANNER.COLUMNS.ID}`, banner_id)
      .update({
        [BANNER.COLUMNS.BANNERNAME]: body.banner_name,
        [BANNER.COLUMNS.BANNERIMAGEURL]: body.banner_image_url,
        [BANNER.COLUMNS.ISACTIVE]: body.is_active
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Subcategory",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function deleteBanner({ banner_id, body, logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME).where(BANNER.COLUMNS.ID, banner_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Banner not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(BANNER.NAME)
      .where(BANNER.COLUMNS.ID, banner_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete banners",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Banner not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getBannersInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(BANNER.NAME).where(BANNER.COLUMNS.ID, params.banner_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Banners Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "banners not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getBanners,
    postBanner,
    putBanner,
    deleteBanner,
    getBannersInfo,
    getBannersPaginate
  };
}

module.exports = bannerRepo;
