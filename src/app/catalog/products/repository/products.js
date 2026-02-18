const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PRODUCTS } = require("../commons/constants");
const { PRODUCTS_VARIANTS } = require("../commons/constants");
const { MAIN_CATEGORY } = require("../commons/constants");
const { SUB_CATEGORY } = require("../commons/constants");
const { BRANDS } = require("../commons/constants");
const { UNITS } = require("../commons/constants");
const { GROUPS } = require("../commons/constants");
const { PRODUCTS_IMAGES } = require("../commons/constants");

function productRepo(fastify) {
  async function getProduct({ page_size, current_page, params, logTrace }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${PRODUCTS.NAME}.*`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.BRAND_NAME}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.GROUP_NAME}`
        ])
        .from(`${PRODUCTS.NAME} as ${PRODUCTS.NAME}`)
        .leftJoin(
          `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${BRANDS.NAME} as ${BRANDS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.ID}`
        )
        .leftJoin(
          `${GROUPS.NAME} as ${GROUPS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.GROUPS_ID}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.ID}`
        );
      if (params.search && params.search.length >= 3) {
        query.where(function () {
          this.where(
            PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION,
            "like",
            `%${params.search}%`
          )
            .orWhere(
              PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION,
              "like",
              `%${params.search}%`
            )
            .orWhere(
              PRODUCTS.COLUMNS.PRODUCT_CODE,
              "like",
              `%${params.search}%`
            );
        });
      }
      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const products = await query
        .orderBy(PRODUCTS.COLUMNS.PRODUCT_CODE, "desc")
        .paginate({
          pageSize: page_size, // Customize as needed
          currentPage: current_page // Customize as needed
        });

      if (products.meta.pagination.total_pages < current_page) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Requested page is beyond the available data",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      if (!products.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const productsWithVariants = await Promise.all(
        products.data.map(async product => {
          const variants = await trx(PRODUCTS_VARIANTS.NAME)
            .join(
              UNITS.NAME,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product.id)
            .select(
              `${PRODUCTS_VARIANTS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`
            );
          const product_images = await trx(PRODUCTS_IMAGES.NAME)
            .where(PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE, product.product_code)
            .where(PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE, true);

          return {
            ...product,
            variants_count: variants.length,
            variants,
            product_images
          };
        })
      );

      return {
        data: productsWithVariants,
        meta: products.meta
      };
    });

    return response;
  }
  async function postProduct({ params, body, logTrace }) {
    const knex = this;
    const query = knex(PRODUCTS.NAME).where(
      PRODUCTS.COLUMNS.PRODUCT_CODE,
      body.product_code
    );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Product Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const existingVariants = await knex(PRODUCTS_VARIANTS.NAME)
      .whereIn(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE, [body.product_code])
      .whereIn(
        PRODUCTS_VARIANTS.COLUMNS.UNITS_ID,
        body.variants.map(variant => variant.units_id)
      );

    if (existingVariants.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Some Product Variants Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${PRODUCTS.NAME}`)
      .returning("id")
      .insert({
        [PRODUCTS.COLUMNS.PRODUCT_CODE]: body.product_code,
        [PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION]:
          body.product_short_description,
        [PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION]:
          body.product_long_description,
        [PRODUCTS.COLUMNS.BRANDS_ID]: body.brands_id,
        [PRODUCTS.COLUMNS.GROUPS_ID]: body.groups_id,
        [PRODUCTS.COLUMNS.MAIN_CATEGORY_ID]: body.main_category_id,
        [PRODUCTS.COLUMNS.SUB_CATEGORY_ID]: body.sub_category_id,
        [PRODUCTS.COLUMNS.STOCK_STATUS]: body.stock_status,
        [PRODUCTS.COLUMNS.SELLER_INFORMATION]: body.seller_information,
        [PRODUCTS.COLUMNS.DIRECTION_OF_USAGE]: body.direction_of_usage,
        [PRODUCTS.COLUMNS.SAFETY_INFORMATION]: body.safety_information,
        [PRODUCTS.COLUMNS.MANUFACTURAR_INFORMATION]:
          body.maufacturar_information,
        [PRODUCTS.COLUMNS.BENEFITS]: body.benefits,
        [PRODUCTS.COLUMNS.IS_ACTIVE]: body.is_active
      });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating ProductS",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    const productId = response[0].id; // productId is auto-generated

    const variants = body.variants.map(variant => ({
      [PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID]: productId,
      [PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE]: body.product_code,
      [PRODUCTS_VARIANTS.COLUMNS.UNITS_ID]: variant.units_id,
      [PRODUCTS_VARIANTS.COLUMNS.MRP]: variant.mrp,
      [PRODUCTS_VARIANTS.COLUMNS.SALES_PRICE]: variant.sales_price,
      [PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_PERCETAGE]:
        variant.discount_percentage,
      [PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_AMOUNT]: variant.discount_amount,
      [PRODUCTS_VARIANTS.COLUMNS.MINIMUM_SALES_QTY]: variant.minimum_sales_qty,
      [PRODUCTS_VARIANTS.COLUMNS.MAXIMUM_SALES_QTY]: variant.maximum_sales_qty,
      [PRODUCTS_VARIANTS.COLUMNS.STOCK_STATUS]: variant.stock_status,
      [PRODUCTS_VARIANTS.COLUMNS.PACKING_WEIGHT]: variant.packing_weight,
      [PRODUCTS_VARIANTS.COLUMNS.GST]: variant.gst,
      [PRODUCTS_VARIANTS.COLUMNS.IGST]: variant.igst,
      [PRODUCTS_VARIANTS.COLUMNS.CESS]: variant.cess,
      [PRODUCTS_VARIANTS.COLUMNS.IS_ACTIVE]: variant.is_active
    }));

    const insertedVariants = await knex(`${PRODUCTS_VARIANTS.NAME}`).insert(
      variants
    );

    if (!insertedVariants) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Product Variants",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    if (
      body.products_images &&
      Array.isArray(body.products_images) &&
      body.products_images.length > 0
    ) {
      const procuctImages = body.products_images.map(products_image => ({
        [PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE]: body.product_code,
        [PRODUCTS_IMAGES.COLUMNS.PRODUCT_IMAGE]: products_image.products_image,
        [PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE]: products_image.is_active
      }));

      const insertedImages = await knex(`${PRODUCTS_IMAGES.NAME}`).insert(
        procuctImages
      );

      if (!insertedImages) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating Product Images",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }
    return { success: true };
  }
  async function putProduct({ product_id, body, logTrace }) {
    const knex = this;
    const query = knex(PRODUCTS.NAME).where(PRODUCTS.COLUMNS.ID, product_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Product not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${PRODUCTS.NAME}`)
      .where(`${PRODUCTS.COLUMNS.ID}`, product_id)
      .update({
        [PRODUCTS.COLUMNS.PRODUCT_SHORT_DESCRIPTION]:
          body.product_short_description,
        [PRODUCTS.COLUMNS.PRODUCT_LONG_DESCRIPTION]:
          body.product_long_description,
        [PRODUCTS.COLUMNS.BRANDS_ID]: body.brands_id,
        [PRODUCTS.COLUMNS.GROUPS_ID]: body.groups_id,
        [PRODUCTS.COLUMNS.MAIN_CATEGORY_ID]: body.main_category_id,
        [PRODUCTS.COLUMNS.SUB_CATEGORY_ID]: body.sub_category_id,
        [PRODUCTS.COLUMNS.STOCK_STATUS]: body.stock_status,
        [PRODUCTS.COLUMNS.SELLER_INFORMATION]: body.seller_information,
        [PRODUCTS.COLUMNS.DIRECTION_OF_USAGE]: body.direction_of_usage,
        [PRODUCTS.COLUMNS.SAFETY_INFORMATION]: body.safety_information,
        [PRODUCTS.COLUMNS.MANUFACTURAR_INFORMATION]:
          body.maufacturar_information,
        [PRODUCTS.COLUMNS.BENEFITS]: body.benefits,
        [PRODUCTS.COLUMNS.IS_ACTIVE]: body.is_active,
        [PRODUCTS.COLUMNS.UPDATED_AT]: new Date()
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Products",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    // in below part it inserting or updating vaianta
    // if data not available it inserts automatically
    // other wise it updates the data against products_code and units_id
    const variants = body.variants.map(variant => ({
      [PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID]: product_id,
      [PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE]: body.product_code,
      [PRODUCTS_VARIANTS.COLUMNS.UNITS_ID]: variant.units_id,
      [PRODUCTS_VARIANTS.COLUMNS.MRP]: variant.mrp,
      [PRODUCTS_VARIANTS.COLUMNS.SALES_PRICE]: variant.sales_price,
      [PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_PERCETAGE]:
        variant.discount_percentage,
      [PRODUCTS_VARIANTS.COLUMNS.DISCOUNT_AMOUNT]: variant.discount_amount,
      [PRODUCTS_VARIANTS.COLUMNS.MINIMUM_SALES_QTY]: variant.minimum_sales_qty,
      [PRODUCTS_VARIANTS.COLUMNS.MAXIMUM_SALES_QTY]: variant.maximum_sales_qty,
      [PRODUCTS_VARIANTS.COLUMNS.STOCK_STATUS]: variant.stock_status,
      [PRODUCTS_VARIANTS.COLUMNS.PACKING_WEIGHT]: variant.packing_weight,
      [PRODUCTS_VARIANTS.COLUMNS.GST]: variant.gst,
      [PRODUCTS_VARIANTS.COLUMNS.IGST]: variant.igst,
      [PRODUCTS_VARIANTS.COLUMNS.CESS]: variant.cess,
      [PRODUCTS_VARIANTS.COLUMNS.IS_ACTIVE]: variant.is_active,
      [PRODUCTS_VARIANTS.COLUMNS.UPDATED_AT]: new Date()
    }));

    const insertedVariants = await knex(`${PRODUCTS_VARIANTS.NAME}`)
      .insert(variants)
      .onConflict([
        PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE,
        PRODUCTS_VARIANTS.COLUMNS.UNITS_ID
      ])
      .merge(); // This assumes .merge() is used for update in your specific knex version/configuration

    if (!insertedVariants) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Product Variants",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    if (
      body.products_images &&
      Array.isArray(body.products_images) &&
      body.products_images.length > 0
    ) {
      const procuctImages = body.products_images.map(products_image => ({
        [PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE]: body.product_code,
        [PRODUCTS_IMAGES.COLUMNS.PRODUCT_IMAGE]: products_image.products_image,
        [PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE]: products_image.is_active,
        [PRODUCTS_IMAGES.COLUMNS.UPDATED_AT]: new Date()
      }));

      const insertedImages = await knex(`${PRODUCTS_IMAGES.NAME}`)
        .insert(procuctImages)
        .onConflict([
          PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE,
          PRODUCTS_IMAGES.COLUMNS.PRODUCT_IMAGE
        ])
        .merge();

      if (!insertedImages) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating Product Images",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }
    return { success: true };
  }
  async function deleteProduct({ product_id, body, logTrace }) {
    const knex = this;
    const query = knex(PRODUCTS.NAME).where(PRODUCTS.COLUMNS.ID, product_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Product not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(PRODUCTS.NAME)
      .where(PRODUCTS.COLUMNS.ID, product_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete ProductS",
      logTrace
    });
    const response = await query_delete;

    if (response) {
      const query_delete_vaiants = knex(PRODUCTS_VARIANTS.NAME)
        .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product_id)
        .del();
      logQuery({
        logger: fastify.log,
        query,
        context: "delete Product variants",
        logTrace
      });
      const response_vaiants = await query_delete_vaiants;

      if (!response_vaiants) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "product variants not found",
          property: "",
          code: "NOT_FOUND"
        });
      }
    }

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "ProductS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return { success: true };
  }
  async function getPriceByVariants({ logTrace, products_code, units_id }) {
    const knex = this;
    const query = knex(PRODUCTS_VARIANTS.NAME)
      .where(PRODUCTS_VARIANTS.COLUMNS.UNITS_ID, units_id)
      .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_CODE, products_code);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Product variant information",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "ProductS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }
  async function getProductDetail({ product_code, logTrace }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${PRODUCTS.NAME}.*`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.BRAND_NAME}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.GROUP_NAME}`
        ])
        .from(`${PRODUCTS.NAME} as ${PRODUCTS.NAME}`)
        .leftJoin(
          `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${BRANDS.NAME} as ${BRANDS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.ID}`
        )
        .leftJoin(
          `${GROUPS.NAME} as ${GROUPS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.GROUPS_ID}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.ID}`
        )
        .where(
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`,
          product_code
        );

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const products = await query;

      if (!products.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const products_details = await Promise.all(
        products.map(async product => {
          const variants = await trx(PRODUCTS_VARIANTS.NAME)
            .join(
              UNITS.NAME,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product.id)
            .select(
              `${PRODUCTS_VARIANTS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`
            );
          const product_images = await trx(PRODUCTS_IMAGES.NAME)
            .where(PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE, product.product_code)
            .where(PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE, true);

          return {
            ...product,
            variants_count: variants.length,
            variants,
            product_images
          };
        })
      );

      return {
        products_details
      };
    });

    return response;
  }
  async function subCategoryCount({ category_id, logTrace }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex(SUB_CATEGORY.NAME)
        .where(SUB_CATEGORY.COLUMNS.IS_ACTIVE, true)
        .where(SUB_CATEGORY.COLUMNS.CATEGORY_ID, category_id)
        .orderBy(SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME, "ASC");

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const subcategories = await query;

      if (!subcategories.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const details = await Promise.all(
        subcategories.map(async subcategory => {
          console.log("subcategory id - " + subcategory.id);
          const products_count = await trx(PRODUCTS.NAME)
            .where(PRODUCTS.COLUMNS.SUB_CATEGORY_ID, subcategory.id)
            .where(PRODUCTS.COLUMNS.IS_ACTIVE, true)
            .select(`${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.PRODUCT_CODE}`);

          return {
            ...subcategory,
            products_count: products_count.length
          };
        })
      );

      return details;
    });

    return response;
  }
  async function getProductBySubCategory({
    subcategory_id,
    page_size,
    current_page,
    logTrace
  }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${PRODUCTS.NAME}.*`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.BRAND_NAME}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.GROUP_NAME}`
        ])
        .from(`${PRODUCTS.NAME} as ${PRODUCTS.NAME}`)
        .leftJoin(
          `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${BRANDS.NAME} as ${BRANDS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.ID}`
        )
        .leftJoin(
          `${GROUPS.NAME} as ${GROUPS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.GROUPS_ID}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.ID}`
        )
        .where(
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          subcategory_id
        );

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const products = await query
        .orderBy(PRODUCTS.COLUMNS.PRODUCT_CODE, "desc")
        .paginate({
          pageSize: page_size, // Customize as needed
          currentPage: current_page // Customize as needed
        });
      if (products.meta.pagination.total_pages < current_page) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Requested page is beyond the available data",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      if (!products.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const productsWithVariants = await Promise.all(
        products.data.map(async product => {
          const variants = await trx(PRODUCTS_VARIANTS.NAME)
            .join(
              UNITS.NAME,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product.id)
            .select(
              `${PRODUCTS_VARIANTS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`
            );
          const product_images = await trx(PRODUCTS_IMAGES.NAME)
            .where(PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE, product.product_code)
            .where(PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE, true);

          return {
            ...product,
            variants_count: variants.length,
            variants,
            product_images
          };
        })
      );

      return {
        data: productsWithVariants,
        meta: products.meta
      };
    });

    return response;
  }
  async function getProductByCategory({
    category_id,
    page_size,
    current_page,
    logTrace
  }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${PRODUCTS.NAME}.*`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.BRAND_NAME}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.GROUP_NAME}`
        ])
        .from(`${PRODUCTS.NAME} as ${PRODUCTS.NAME}`)
        .leftJoin(
          `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${BRANDS.NAME} as ${BRANDS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.ID}`
        )
        .leftJoin(
          `${GROUPS.NAME} as ${GROUPS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.GROUPS_ID}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.ID}`
        )
        .where(
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          category_id
        );

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const products = await query
        .orderBy(PRODUCTS.COLUMNS.PRODUCT_CODE, "desc")
        .paginate({
          pageSize: page_size, // Customize as needed
          currentPage: current_page // Customize as needed
        });
      if (products.meta.pagination.total_pages < current_page) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Requested page is beyond the available data",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      if (!products.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const productsWithVariants = await Promise.all(
        products.data.map(async product => {
          const variants = await trx(PRODUCTS_VARIANTS.NAME)
            .join(
              UNITS.NAME,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product.id)
            .select(
              `${PRODUCTS_VARIANTS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`
            );
          const product_images = await trx(PRODUCTS_IMAGES.NAME)
            .where(PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE, product.product_code)
            .where(PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE, true);

          return {
            ...product,
            variants_count: variants.length,
            variants,
            product_images
          };
        })
      );

      return {
        data: productsWithVariants,
        meta: products.meta
      };
    });

    return response;
  }
  async function getProductByBrand({
    brand_id,
    page_size,
    current_page,
    logTrace
  }) {
    const knex = this;

    const response = await knex.transaction(async trx => {
      // Fetch products
      const query = knex
        .select([
          `${PRODUCTS.NAME}.*`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.CATEGORY_NAME}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.SUBCATEGORY_NAME}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.BRAND_NAME}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.GROUP_NAME}`
        ])
        .from(`${PRODUCTS.NAME} as ${PRODUCTS.NAME}`)
        .leftJoin(
          `${MAIN_CATEGORY.NAME} as ${MAIN_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.MAIN_CATEGORY_ID}`,
          `${MAIN_CATEGORY.NAME}.${MAIN_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${SUB_CATEGORY.NAME} as ${SUB_CATEGORY.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.SUB_CATEGORY_ID}`,
          `${SUB_CATEGORY.NAME}.${SUB_CATEGORY.COLUMNS.ID}`
        )
        .leftJoin(
          `${BRANDS.NAME} as ${BRANDS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`,
          `${BRANDS.NAME}.${BRANDS.COLUMNS.ID}`
        )
        .leftJoin(
          `${GROUPS.NAME} as ${GROUPS.NAME}`,
          `${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.GROUPS_ID}`,
          `${GROUPS.NAME}.${GROUPS.COLUMNS.ID}`
        )
        .where(`${PRODUCTS.NAME}.${PRODUCTS.COLUMNS.BRANDS_ID}`, brand_id);

      logQuery({
        logger: fastify.log,
        query,
        context: "Get product list details",
        logTrace
      });

      const products = await query
        .orderBy(PRODUCTS.COLUMNS.PRODUCT_CODE, "desc")
        .paginate({
          pageSize: page_size, // Customize as needed
          currentPage: current_page // Customize as needed
        });
      if (products.meta.pagination.total_pages < current_page) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Requested page is beyond the available data",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }
      if (!products.data.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Products not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      const productsWithVariants = await Promise.all(
        products.data.map(async product => {
          const variants = await trx(PRODUCTS_VARIANTS.NAME)
            .join(
              UNITS.NAME,
              `${PRODUCTS_VARIANTS.NAME}.${PRODUCTS_VARIANTS.COLUMNS.UNITS_ID}`,
              "=",
              `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
            )
            .where(PRODUCTS_VARIANTS.COLUMNS.PRODUCTS_ID, product.id)
            .select(
              `${PRODUCTS_VARIANTS.NAME}.*`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME}`,
              `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_LONG_NAME}`
            );
          const product_images = await trx(PRODUCTS_IMAGES.NAME)
            .where(PRODUCTS_IMAGES.COLUMNS.PRODUCT_CODE, product.product_code)
            .where(PRODUCTS_IMAGES.COLUMNS.IS_ACTIVE, true);

          return {
            ...product,
            variants_count: variants.length,
            variants,
            product_images
          };
        })
      );

      return {
        data: productsWithVariants,
        meta: products.meta
      };
    });

    return response;
  }
  return {
    getProduct,
    postProduct,
    putProduct,
    deleteProduct,
    getPriceByVariants,
    getProductDetail,
    subCategoryCount,
    getProductBySubCategory,
    getProductByCategory,
    getProductByBrand
  };
}

module.exports = productRepo;
