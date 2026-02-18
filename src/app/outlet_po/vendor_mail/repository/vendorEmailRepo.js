const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash");
const { VENDOR_MAIL } = require("../commons/constants")
const { SUPPLIER, OUTLET_PRODUCT_MAPPING, TYPEDESIGN, } = require("../../../catalog/item/commons/constants")
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { REGION } = require("../../../catalog/warehouse/commons/constants");
const excelImportRepo = require("../../../Excelupload/repository/excelmport");

function vendorEmailRepo(fastify) {

  async function getVendorEmailRepo({ params, queryString, logTrace }) {
    const knex = this;
    const { current_page, page_size } = params;
    const { search } = queryString;

    let query = knex(VENDOR_MAIL.NAME)
      .select([
        `${VENDOR_MAIL.NAME}.*`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
      ])
      .leftJoin(
        TYPEDESIGN.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        OUTLETS.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        SUPPLIER.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        REGION.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

    if (search && search.length >= 3) {
      query.andWhere(function () {
        this.where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`, "ilike", `%${search}%`);
      });
    }

    query.orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "ASC");

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No vendor email found.",
        code: "NOT_FOUND"
      });
    }

    // ✅ Convert stored strings → arrays
    const formattedResponse = response.map(row => ({
      ...row,
      outlet_email: JSON.parse(row.outlet_email || "[]"),
      brand_company_email: JSON.parse(row.brand_company_email || "[]"),
      supplier_email: JSON.parse(row.supplier_email || "[]")
    }));

    const total = formattedResponse.length;
    const total_pages = Math.ceil(total / page_size);

    if (current_page > total_pages) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        code: "NOT_ACCEPTABLE"
      });
    }

    const start = (current_page - 1) * page_size;

    // ✅ Use formattedResponse for pagination
    const paginatedData = formattedResponse.slice(start, start + page_size);

    return {
      data: paginatedData,
      meta: {
        pagination: {
          total,
          page: current_page,
          page_size,
          total_pages
        }
      }
    };
  }

  async function getVendorEmailByIdRepo({ params, logTrace }) {
    const knex = this;
    const { id } = params;

    const query = knex(VENDOR_MAIL.NAME)
      .select([
        `${VENDOR_MAIL.NAME}.*`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
      ])
      .leftJoin(
        TYPEDESIGN.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        OUTLETS.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        SUPPLIER.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        REGION.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .where(`${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.ID}`, id)
      .andWhere(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Vendor Mail By Id",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No vendor email found.",
        code: "NOT_FOUND"
      });
    }

    const formattedResponse = response.map(row => ({
      ...row,
      outlet_email: JSON.parse(row.outlet_email || "[]"),
      brand_company_email: JSON.parse(row.brand_company_email || "[]"),
      supplier_email: JSON.parse(row.supplier_email || "[]")
    }));


    return formattedResponse;
  }

  // async function getVendorEmailExcelExportRepo({ params, logTrace }) {
  //   const knex = this;


  //   const query = knex(VENDOR_MAIL.NAME)
  //     .select([
  //       `${VENDOR_MAIL.NAME}.*`,
  //       `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
  //       `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
  //     ])
  //     .leftJoin(
  //       TYPEDESIGN.NAME,
  //       `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID}`,
  //       `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       OUTLETS.NAME,
  //       `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`,
  //       `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       SUPPLIER.NAME,
  //       `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.SUPPLIER_ID}`,
  //       `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
  //     )
  //     .leftJoin(
  //       REGION.NAME,
  //       `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.REGION_ID}`,
  //       `${REGION.NAME}.${REGION.COLUMNS.ID}`
  //     )
  //     .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
  //     .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
  //     .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

  //   logQuery({
  //     logger: fastify.log,
  //     query,
  //     context: "Get Vendor Mail for excel export",
  //     logTrace
  //   });

  //   const response = await query;

  //   if (!response.length) {
  //     throw CustomError.create({
  //       httpCode: StatusCodes.NOT_FOUND,
  //       message: "No vendor email found.",
  //       code: "NOT_FOUND"
  //     });
  //   }

  //   return response.map(row => ({
  //     ...row,
  //     outlet_email: safeParse(row.outlet_email),
  //     brand_company_email: safeParse(row.brand_company_email),
  //     supplier_email: safeParse(row.supplier_email)
  //   }));
  // }

  async function getVendorEmailExcelExportRepo({ params, body, logTrace }) {
    const knex = this;
    const { region_id, outlet_id } = body;

    if (!Number(region_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id required",
        code: "INVALID_INPUT"
      });
    }

    if (!outlet_id || !outlet_id.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    const query = knex(VENDOR_MAIL.NAME)
      .select([
        `${VENDOR_MAIL.NAME}.*`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME} as outlet_name`,
        `${REGION.NAME}.${REGION.COLUMNS.REGION_NAME} as region_name`,
      ])
      .leftJoin(
        TYPEDESIGN.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .leftJoin(
        OUTLETS.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`,
        `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
      )
      .leftJoin(
        SUPPLIER.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .leftJoin(
        REGION.NAME,
        `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.REGION_ID}`,
        `${REGION.NAME}.${REGION.COLUMNS.ID}`
      )
      .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .andWhere(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

    let outletIdArray = outlet_id.map(id => Number(id));

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
    }

    const outletIds = await outletIdsQuery;
    if (outletIds.length === 0) return [];

    query.whereIn(
      `${VENDOR_MAIL.NAME}.${VENDOR_MAIL.COLUMNS.OUTLET_ID}`,
      outletIds
    )

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Vendor Mail for excel export",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No vendor email found.",
        code: "NOT_FOUND"
      });
    }

    return response.map(row => ({
      ...row,
      outlet_email: safeParse(row.outlet_email),
      brand_company_email: safeParse(row.brand_company_email),
      supplier_email: safeParse(row.supplier_email)
    }));
  }

  function safeParse(value) {
    try {
      return JSON.parse(value || "[]");
    } catch {
      return [];
    }
  }

  const normalizeEmails = (emails) => {
    if (!emails) return [];

    if (Array.isArray(emails)) {
      return emails
        .map(e => (e?.email || "").trim().toLowerCase())
        .filter(e => e.length > 0);
    }

    return emails
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);
  };

  async function putVendorEmailRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const trx = await knex.transaction();

    try {
      const { id } = params;

      if (!id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "id is required",
          code: "NOT_ACCEPTABLE"
        });
      }

      const existing = await trx(VENDOR_MAIL.NAME)
        .select(VENDOR_MAIL.COLUMNS.ID)
        .where(VENDOR_MAIL.COLUMNS.ID, id)
        .first();

      if (!existing) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Vendor mail record not found",
          code: "NOT_FOUND"
        });
      }

      const {
        outlet_email = [],
        brand_company_email = [],
        supplier_email = [],
        is_active = true
      } = body;

      if (!Array.isArray(outlet_email) || normalizeEmails(outlet_email).length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "outlet_email must be a non-empty array of { email }",
          code: "NOT_ACCEPTABLE"
        });
      }

      if (!Array.isArray(brand_company_email) || normalizeEmails(brand_company_email).length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "brand_company_email must be a non-empty array of { email }",
          code: "NOT_ACCEPTABLE"
        });
      }

      if (!Array.isArray(supplier_email) || normalizeEmails(supplier_email).length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "supplier_email must be a non-empty array of { email }",
          code: "NOT_ACCEPTABLE"
        });
      }

      const uniqueOutlet = [...new Set(normalizeEmails(outlet_email))];
      const uniqueBrand = [...new Set(normalizeEmails(brand_company_email))];
      const uniqueSupplier = [...new Set(normalizeEmails(supplier_email))];

      const updatePayload = {
        [VENDOR_MAIL.COLUMNS.OUTLET_MAIL]: JSON.stringify(uniqueOutlet),
        [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL]: JSON.stringify(uniqueBrand),
        [VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL]: JSON.stringify(uniqueSupplier),
        [VENDOR_MAIL.COLUMNS.UPDATED_BY]: userDetails?.id ?? null,
        [VENDOR_MAIL.COLUMNS.IS_ACTIVE]: is_active
      };

      await trx(VENDOR_MAIL.NAME)
        .where(VENDOR_MAIL.COLUMNS.ID, id)
        .update(updatePayload);

      await trx.commit();
      return {
        success: true
      };

    } catch (error) {
      await trx.rollback();
      logTrace?.error?.("putVendorEmailRepo error:", error);

      if (error instanceof CustomError) throw error;

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Vendor Email update failed.",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  async function postVendorEmailRepo({ params, body, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();

    try {
      const {
        region_id,
        outlet_id,
        outlet_email,
        brand_company_id,
        brand_company_email,
        supplier_id,
        supplier_email
      } = body;

      if (!Array.isArray(outlet_email) || normalizeEmails(outlet_email).length === 0)
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "outlet_email cannot be an empty array",
          code: "NOT_ACCEPTABLE"
        });

      if (!Array.isArray(brand_company_email) || normalizeEmails(brand_company_email).length === 0)
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "brand_company_email cannot be an empty array",
          code: "NOT_ACCEPTABLE"
        });

      if (!Array.isArray(supplier_email) || normalizeEmails(supplier_email).length === 0)
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "supplier_email cannot be an empty array",
          code: "NOT_ACCEPTABLE"
        });

      if (!Array.isArray(outlet_id)) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "outlet_id must be an array",
          code: "NOT_ACCEPTABLE"
        });
      }

      let outletIdArray = outlet_id.map(id => Number(id));

      let outletIdsQuery = knex(OUTLETS.NAME)
        .pluck(OUTLETS.COLUMNS.ID)
        .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

      if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
        outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
      }

      const outletIds = await outletIdsQuery;

      if (outletIds.length === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Invalid outlet_id and region_id",
          code: "NOT_FOUND"
        });
      }

      let validMappingCount = 0;

      for (const oid of outletIds) {
        const mappingValidation = await trx(OUTLET_PRODUCT_MAPPING.NAME)
          .select(OUTLET_PRODUCT_MAPPING.COLUMNS.ID)
          .where({
            [OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID]: oid,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID]: supplier_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
            [OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE]: true
          })
          .first();

        if (!mappingValidation) continue;

        validMappingCount++;

        const existing = await trx(VENDOR_MAIL.NAME)
          .select(
            VENDOR_MAIL.COLUMNS.ID,
            VENDOR_MAIL.COLUMNS.OUTLET_MAIL,
            VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL,
            VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL
          )
          .where({
            [VENDOR_MAIL.COLUMNS.REGION_ID]: region_id,
            [VENDOR_MAIL.COLUMNS.OUTLET_ID]: oid,
            [VENDOR_MAIL.COLUMNS.SUPPLIER_ID]: supplier_id,
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
            [VENDOR_MAIL.COLUMNS.IS_ACTIVE]: true
          })
          .first();

        if (!existing) {
          await trx(VENDOR_MAIL.NAME).insert({
            [VENDOR_MAIL.COLUMNS.REGION_ID]: region_id,
            [VENDOR_MAIL.COLUMNS.OUTLET_ID]: oid,
            [VENDOR_MAIL.COLUMNS.OUTLET_MAIL]: JSON.stringify(normalizeEmails(outlet_email)),
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID]: brand_company_id,
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL]: JSON.stringify(normalizeEmails(brand_company_email)),
            [VENDOR_MAIL.COLUMNS.SUPPLIER_ID]: supplier_id,
            [VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL]: JSON.stringify(normalizeEmails(supplier_email)),
            [VENDOR_MAIL.COLUMNS.IS_ACTIVE]: true,
            [VENDOR_MAIL.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDOR_MAIL.COLUMNS.UPDATED_BY]: userDetails.id,
            [VENDOR_MAIL.COLUMNS.CREATED_AT]: new Date(),
          });

          continue;
        }

        const mergedOutletEmails = [
          ...new Set([
            ...normalizeEmails(existing.outlet_mail),
            ...normalizeEmails(outlet_email)
          ])
        ];

        const mergedBrandCompanyEmails = [
          ...new Set([
            ...normalizeEmails(existing.brand_company_mail),
            ...normalizeEmails(brand_company_email)
          ])
        ];

        const mergedSupplierEmails = [
          ...new Set([
            ...normalizeEmails(existing.supplier_mail),
            ...normalizeEmails(supplier_email)
          ])
        ];

        await trx(VENDOR_MAIL.NAME)
          .where({ [VENDOR_MAIL.COLUMNS.ID]: existing.id })
          .update({
            [VENDOR_MAIL.COLUMNS.OUTLET_MAIL]: JSON.stringify(mergedOutletEmails),
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL]: JSON.stringify(mergedBrandCompanyEmails),
            [VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL]: JSON.stringify(mergedSupplierEmails),
            [VENDOR_MAIL.COLUMNS.UPDATED_BY]: userDetails.id
          });
      }

      if (validMappingCount === 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "No mapping found — invalid outlet_id, supplier_id or brand_company_id combination",
          code: "NOT_FOUND"
        });
      }

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();

      if (error instanceof CustomError) throw error;

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Vendor Email transaction failed.",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  async function getVendorMailBrandCompanyListRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const { region_id, outlet_id } = body;

    if (!Number(region_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id required",
        code: "INVALID_INPUT"
      });
    }

    if (!outlet_id || !outlet_id.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    const query = knex
      .distinct([
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID} as brand_company_id`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME} as brand_company_name`,
      ])
      .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .leftJoin(
        `${TYPEDESIGN.NAME} as ${TYPEDESIGN.NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`,
        `${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.ID}`
      )
      .where(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.IS_ACTIVE}`, true)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${TYPEDESIGN.NAME}.${TYPEDESIGN.COLUMNS.TYPE_NAME}`, "asc");

    let outletIdArray = outlet_id.map(id => Number(id));

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
    }

    const outletIds = await outletIdsQuery;
    if (outletIds.length === 0) return [];

    query.whereIn(
      `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
      outletIds
    )

    query.where(
      `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`,
      true
    )


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Brand Company list",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Brans Company for Outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getVendorMailSupplierListRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const { region_id, outlet_id, brand_company_id } = body;

    if (!Number(region_id) || !Number(brand_company_id)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "region_id and brand_company_id both are required",
        code: "INVALID_INPUT"
      });
    }

    if (!outlet_id || !outlet_id.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "outlet_id required",
        code: "INVALID_INPUT"
      });
    }

    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID} as supplier_id`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_CODE} as supplier_code`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME} as supplier_name`,
      ])
      .from(`${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING.NAME}`)
      .leftJoin(
        `${SUPPLIER.NAME} as ${SUPPLIER.NAME}`,
        `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.SUPPLIER_ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BRAND_COMPANY_ID}`, brand_company_id)
      .where(`${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .orderBy(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "asc");

    let outletIdArray = outlet_id.map(id => Number(id));

    let outletIdsQuery = knex(OUTLETS.NAME)
      .pluck(OUTLETS.COLUMNS.ID)
      .where(OUTLETS.COLUMNS.REGION_ID, Number(region_id));

    if (!(outletIdArray.length === 1 && outletIdArray[0] === -1)) {
      outletIdsQuery.whereIn(OUTLETS.COLUMNS.ID, outletIdArray);
    }

    const outletIds = await outletIdsQuery;
    if (outletIds.length === 0) return [];

    query.whereIn(
      `${OUTLET_PRODUCT_MAPPING.NAME}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
      outletIds
    );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier list",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier for outlet not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function deleteVendorEmailRepo({ params, body, userDetails, logTrace }) {
    const knex = this;
    const trx = await knex.transaction();

    try {
      const { id } = params;

      if (!id) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "id is required",
          code: "NOT_ACCEPTABLE"
        });
      }

      const existing = await trx(VENDOR_MAIL.NAME)
        .select(VENDOR_MAIL.COLUMNS.ID)
        .where(VENDOR_MAIL.COLUMNS.ID, id)
        .first();

      if (!existing) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Vendor mail record not found",
          code: "NOT_FOUND"
        });
      }

      await trx(VENDOR_MAIL.NAME)
        .where(VENDOR_MAIL.COLUMNS.ID, id)
        .del();

      await trx.commit();
      return {
        success: true,
        message: "Vendor mail deleted successfully"
      };

    } catch (error) {
      await trx.rollback();
      logTrace?.error?.("deleteVendorEmailRepo error:", error);

      if (error instanceof CustomError) throw error;

      throw CustomError.create({
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Vendor Email deletion failed.",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
  }

  const normalizeEmailsImport = (value) => {
    if (!value) return [];
    return value
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
  };

  const uniqueEmails = (arr = []) => [...new Set(arr)];

  async function vendorMailExcelImportRepo({ body, params, logTrace, query, userDetails }) {
    const knex = this;
    const trx = await knex.transaction();
    const { uploadExcelData } = excelImportRepo(fastify);

    try {
      /* ================= STEP 1: Read Excel ================= */
      const excelColumnData = await uploadExcelData.call(knex, { body, params, logTrace });

      const excelColumns = excelColumnData.headers.map(h =>
        h.toLowerCase().trim().replace(/\s+/g, "")
      );
      const excelData = excelColumnData.data;

      /* ================= STEP 2: Validate Columns ================= */
      const requiredColumns = [
        "outletcode",
        "suppliercode",
        "brandcompanyname",
        "outletmail",
        "suppliermail",
        "brandcompanymail"
      ];

      const missingColumns = requiredColumns.filter(c => !excelColumns.includes(c));
      if (missingColumns.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: `Missing required columns: ${missingColumns.join(", ")}`,
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      if (!excelData.length) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "No records found in Excel",
          code: "EXCEL_IMPORT_FAILED"
        });
      }

      /* ================= STEP 3: Collect Codes ================= */
      const outletCodes = [...new Set(excelData.map(r => r.outletcode))];
      const supplierCodes = [...new Set(excelData.map(r => r.suppliercode))];
      const brandNames = [...new Set(excelData.map(r => r.brandcompanyname))];

      /* ================= STEP 4: Fetch Masters ================= */
      const outletRows = await trx(OUTLETS.NAME)
        .select(
          OUTLETS.COLUMNS.ID,
          OUTLETS.COLUMNS.BANKID,
          OUTLETS.COLUMNS.REGION_ID
        )
        .whereIn(OUTLETS.COLUMNS.BANKID, outletCodes)
        .andWhere(OUTLETS.COLUMNS.IS_ACTIVE, true);

      const outletMap = {};
      const outletRegionMap = {};
      outletRows.forEach(o => {
        outletMap[o.bankid] = o.id;
        outletRegionMap[o.bankid] = o.region_id;
      });

      const supplierRows = await trx(SUPPLIER.NAME)
        .select(
          SUPPLIER.COLUMNS.ID,
          SUPPLIER.COLUMNS.SUPPLIER_CODE
        )
        .whereIn(SUPPLIER.COLUMNS.SUPPLIER_CODE, supplierCodes)
        .andWhere(SUPPLIER.COLUMNS.IS_ACTIVE, true);

      const supplierMap = {};
      supplierRows.forEach(s => {
        supplierMap[s.supplier_code] = { id: s.id };
      });

      const brandRows = await trx(TYPEDESIGN.NAME)
        .select(
          TYPEDESIGN.COLUMNS.ID,
          TYPEDESIGN.COLUMNS.TYPE_NAME
        )
        .whereIn(TYPEDESIGN.COLUMNS.TYPE_NAME, brandNames)
        .andWhere(TYPEDESIGN.COLUMNS.IS_ACTIVE, true);

      const brandMap = {};
      brandRows.forEach(b => {
        brandMap[b.type_name] = { id: b.id };
      });

      /* ================= STEP 5: INSERT / UPDATE ================= */
      for (const row of excelData) {

        // Skip row if all emails empty
        if (!row.outletmail && !row.suppliermail && !row.brandcompanymail) continue;

        const outlet_id = outletMap[row.outletcode];
        const region_id = outletRegionMap[row.outletcode];
        const supplier = supplierMap[row.suppliercode];
        const brandCompany = brandMap[row.brandcompanyname];

        if (!outlet_id || !supplier || !brandCompany) continue;

        const outletEmails = normalizeEmailsImport(row.outletmail);
        const supplierEmails = normalizeEmailsImport(row.suppliermail);
        const brandCompanyEmails = normalizeEmailsImport(row.brandcompanymail);

        if (
          !outletEmails.length ||
          !supplierEmails.length ||
          !brandCompanyEmails.length
        ) {
          continue;
        }

        const existing = await trx(VENDOR_MAIL.NAME)
          .where({
            [VENDOR_MAIL.COLUMNS.OUTLET_ID]: outlet_id,
            [VENDOR_MAIL.COLUMNS.SUPPLIER_ID]: supplier.id,
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID]: brandCompany.id,
            [VENDOR_MAIL.COLUMNS.IS_ACTIVE]: true
          })
          .first();

        if (existing) {
          await trx(VENDOR_MAIL.NAME)
            .where({ [VENDOR_MAIL.COLUMNS.ID]: existing.id })
            .update({
              // ✅ Replace completely (no merge)
              [VENDOR_MAIL.COLUMNS.OUTLET_MAIL]: JSON.stringify(uniqueEmails(outletEmails)),
              [VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL]: JSON.stringify(uniqueEmails(supplierEmails)),
              [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL]: JSON.stringify(uniqueEmails(brandCompanyEmails)),

              [VENDOR_MAIL.COLUMNS.UPDATED_BY]: userDetails.id,
              [VENDOR_MAIL.COLUMNS.UPDATED_AT]: knex.fn.now()
            });

        } else {
          await trx(VENDOR_MAIL.NAME).insert({
            [VENDOR_MAIL.COLUMNS.REGION_ID]: region_id,
            [VENDOR_MAIL.COLUMNS.OUTLET_ID]: outlet_id,
            [VENDOR_MAIL.COLUMNS.SUPPLIER_ID]: supplier.id,
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_ID]: brandCompany.id,

            [VENDOR_MAIL.COLUMNS.OUTLET_MAIL]: JSON.stringify(uniqueEmails(outletEmails)),
            [VENDOR_MAIL.COLUMNS.SUPPLIER_MAIL]: JSON.stringify(uniqueEmails(supplierEmails)),
            [VENDOR_MAIL.COLUMNS.BRAND_COMPANY_MAIL]: JSON.stringify(uniqueEmails(brandCompanyEmails)),

            [VENDOR_MAIL.COLUMNS.IS_ACTIVE]: true,
            [VENDOR_MAIL.COLUMNS.CREATED_BY]: userDetails.id,
            [VENDOR_MAIL.COLUMNS.UPDATED_BY]: userDetails.id,
            [VENDOR_MAIL.COLUMNS.CREATED_AT]: knex.fn.now()
          });

        }
      }

      await trx.commit();
      return { success: true };

    } catch (error) {
      await trx.rollback();
      throw error._code
        ? error
        : CustomError.create({
          httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Vendor mail import failed",
          code: "EXCEL_IMPORT_FAILED"
        });
    }
  }

  return {
    getVendorEmailRepo,
    putVendorEmailRepo,
    postVendorEmailRepo,
    getVendorMailSupplierListRepo,
    getVendorMailBrandCompanyListRepo,
    getVendorEmailByIdRepo,
    deleteVendorEmailRepo,
    getVendorEmailExcelExportRepo,
    vendorMailExcelImportRepo
  };
}

module.exports = vendorEmailRepo


