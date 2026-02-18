const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const _ = require("lodash");
const { WAREHOUSE, WAREHOUSE_LOGS, SUPPLIER, PURCHASE_MST, WAREHOUSE_COMPANY_MAPPING, REGION } = require("../commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");
const { OUTLETS } = require("../../../accounts/outlets/commons/constants");
const { WAREHOUSE_MAPPING, COMPANY_USER_MAPPING } = require("../../../accounts/admin/commons/constants");
const { WAREHOUSE_PRODUCTS_MAPPING, PURCHASE_FMCG_MASTER } = require("../../commons");
const { COMPANY } = require("../../../accounts/company/commons/constants");
const { ITEM } = require("../../../catalog/commons")
const { UNITS } = require("../../../catalog/units/commons/constants");


function wareHouseRepo(fastify) {
  async function getWareHouse({ logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${WAREHOUSE.NAME}.*`,
        'opm.balance_stock as warehouse_stock',       // Fixed typo
        'opm.is_active as warehouse_is_active'
      ])
      .from(`${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`)
      .leftJoin(
        knex.raw(`
      (
        SELECT DISTINCT ON (${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID}) 
          ${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID} as warehouse_id,
          balance_stock,
          is_active
        FROM ${WAREHOUSE_PRODUCTS_MAPPING.NAME}
        ORDER BY ${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.WAREHOUSE_ID}, created_at DESC, updated_at DESC
      ) as opm
    `),
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`,
        'opm.warehouse_id'
      );

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Warehouse",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Warehouse not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    const updatedResponse = _.map(response, warehouse => ({
      ...warehouse,
      warehouse_stock: warehouse.warehouse_stock == null ? 0 : warehouse.warehouse_stock,
      warehouse_is_active: warehouse.warehouse_is_active == null ? false : warehouse.warehouse_is_active
    }));
    ;

    return updatedResponse;
  }


  async function getWareHousePaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { page_size, current_page } = params;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${WAREHOUSE.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`, true
      )
      .orderBy(WAREHOUSE.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`,
        1
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`,
        0
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(WAREHOUSE.COLUMNS.WAREHOUSE_NAME, "ilike", `%${search}%`)
          .orWhere(WAREHOUSE.COLUMNS.SHORT_NAME, "ilike", `%${search}%`)
          .orWhere(WAREHOUSE.COLUMNS.CONTACT_NAME, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get WAREHOUSE",
      logTrace
    });
    const response = await query.paginate({
      pageSize: page_size,
      currentPage: current_page
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "WAREHOUSE not found",
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

    const warehouseWithCompany = await Promise.all(
      response.data.map(async warehouse => {

        const company_details = await knex
          .select([
            `${COMPANY.NAME}.*`,
            knex.raw(
              `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
            ),
            knex.raw(
              `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
            ),
            knex.raw(
              `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
            )
          ])
          .from(`${WAREHOUSE_COMPANY_MAPPING.NAME} as ${WAREHOUSE_COMPANY_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .leftJoin(
            `${COMPANY.NAME} as ${COMPANY.NAME}`,
            `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
          )
          .leftJoin(
            `${STATES.NAME} as ${STATES.NAME}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
            `${STATES.NAME}.${STATES.COLUMNS.ID}`
          )
          .leftJoin(
            `${CITIES.NAME} as ${CITIES.NAME}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
            `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
          )
          .leftJoin(
            `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
          )
          .where(
            `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            warehouse.id
          );

        return { ...warehouse, company_details };
      })
    );
    const combinedResponse = {
      data: warehouseWithCompany,
      meta: response.meta
    };

    return combinedResponse;
  }
  async function postWareHouse({ params, body, logTrace, userDetails }) {
    const knex = this;

    // Start transaction
    const trx = await knex.transaction();

    try {
      const { main_warehouse } = body;

      // Check if warehouse name already exists
      const exists_response = await trx(WAREHOUSE.NAME)
        .where(WAREHOUSE.COLUMNS.WAREHOUSE_NAME, String(body.warehouse_name).trim());

      if (exists_response.length > 0) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Warehouse Name Already Exists",
          property: "",
          code: "NOT_ACCEPTABLE"
        });
      }

      // Check if a main warehouse already exists
      if (main_warehouse === true) {
        const check_main_warehouse = await trx(WAREHOUSE.NAME)
          .where(WAREHOUSE.COLUMNS.MAIN_WAREHOUSE, true);

        if (check_main_warehouse.length > 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: "Main Warehouse Already Exists",
            property: "",
            code: "NOT_ACCEPTABLE"
          });
        }
      }

      // Insert new warehouse
      const [inserted] = await trx(WAREHOUSE.NAME)
        .returning("id")
        .insert({
          [WAREHOUSE.COLUMNS.WAREHOUSE_NAME]: String(body.warehouse_name).trim(),
          [WAREHOUSE.COLUMNS.SHORT_NAME]: String(body.short_name).trim(),
          [WAREHOUSE.COLUMNS.ADD1]: body.add1,
          [WAREHOUSE.COLUMNS.ADD2]: body.add2,
          [WAREHOUSE.COLUMNS.ADD3]: body.add3,
          [WAREHOUSE.COLUMNS.ADD4]: body.add4,
          [WAREHOUSE.COLUMNS.CITYID]: body.city,
          [WAREHOUSE.COLUMNS.PINCODE]: body.pincode,
          [WAREHOUSE.COLUMNS.STATEID]: body.state,
          [WAREHOUSE.COLUMNS.COUNTRYID]: body.country,
          [WAREHOUSE.COLUMNS.PHONE]: body.phone,
          [WAREHOUSE.COLUMNS.MOBILE]: body?.mobile ? String(body.mobile) : null,
          [WAREHOUSE.COLUMNS.EMAIL]: body.email,
          [WAREHOUSE.COLUMNS.COMPANY_ID]: body.company_id,
          [WAREHOUSE.COLUMNS.CREATED_BY]: userDetails.id,
          [WAREHOUSE.COLUMNS.LIMITATION]: body.limitation,
          [WAREHOUSE.COLUMNS.GSTIN]: body.gstin,
          [WAREHOUSE.COLUMNS.FSSAI]: body.fssai,
          [WAREHOUSE.COLUMNS.ISGST]: body.is_gst,
          [WAREHOUSE.COLUMNS.BANKACNO]: body.bankacno,
          [WAREHOUSE.COLUMNS.BANKNAME]: body.bankname,
          [WAREHOUSE.COLUMNS.ACNAME]: body.acname,
          [WAREHOUSE.COLUMNS.IFSCCODE]: body.ifsccode,
          [WAREHOUSE.COLUMNS.WALLET_BALANCE]: body.wallet_balance,
          [WAREHOUSE.COLUMNS.MAIN_WAREHOUSE]: body.main_warehouse,
          [WAREHOUSE.COLUMNS.CONTACT_NAME]: body.contact_name
        });

      if (!inserted) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating warehouse",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }

      const warehouse_id = inserted.id;

      // Insert warehouse-company mapping
      if (body.company_details?.length > 0) {
        const [{ max_id }] = await trx(WAREHOUSE_COMPANY_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1;

        const company = body.company_details.map((company, index) => ({
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.ID]: nextId + index,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID]: company.company_id,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouse_id,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.CREATED_AT]: new Date(),
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(WAREHOUSE_COMPANY_MAPPING.NAME).insert(company);
      }

      // Insert into logs
      await trx(WAREHOUSE_LOGS.NAME).insert({
        [WAREHOUSE_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
        [WAREHOUSE_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [WAREHOUSE_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [WAREHOUSE_LOGS.COLUMNS.WAREHOUSE_ID]: warehouse_id,
        [WAREHOUSE_LOGS.COLUMNS.WAREHOUSE_NAME]: String(body.warehouse_name).trim()
      });

      // Commit transaction
      await trx.commit();

      return { success: true };
    } catch (error) {
      // Rollback on error
      await trx.rollback(); // Rollback transaction if any error occurs

      console.error("Transaction Failed:", error);

      // ✅ Catch and return structured error to the frontend
      if (error instanceof CustomError) {
        console.log(error, "error message");
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors[0].message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }

  async function putWareHouse({ body, logTrace, userDetails, params }) {
    const knex = this;
    const { warehouse_id } = params;

    const trx = await knex.transaction();

    try {
      const exists_response = await trx(WAREHOUSE.NAME)
        .where(WAREHOUSE.COLUMNS.ID, warehouse_id)

      if (!exists_response.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Warehouse not found to update",
          code: "NOT_ACCEPTABLE"
        });
      }

      const nameExists = await trx(WAREHOUSE.NAME)
        .whereNot(WAREHOUSE.COLUMNS.ID, warehouse_id)
        .andWhere(WAREHOUSE.COLUMNS.WAREHOUSE_NAME, String(body.warehouse_name).trim())

      if (nameExists.length) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_ACCEPTABLE,
          message: "Warehouse name already exists",
          code: "NOT_ACCEPTABLE"
        });
      }

      if (body.main_warehouse === true) {
        const check_main = await trx(WAREHOUSE.NAME)
          .whereNot(WAREHOUSE.COLUMNS.ID, warehouse_id)
          .andWhere(WAREHOUSE.COLUMNS.MAIN_WAREHOUSE, true)

        if (check_main.length > 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: "Main Warehouse Already Exists",
            code: "NOT_ACCEPTABLE"
          });
        }
      }

      if (body.main_warehouse === false) {
        const currentWarehouse = await trx(WAREHOUSE.NAME)
          .where(WAREHOUSE.COLUMNS.ID, warehouse_id)
          .first();

        if (currentWarehouse?.main_warehouse === true) {
          const otherMain = await trx(WAREHOUSE.NAME)
            .whereNot(WAREHOUSE.COLUMNS.ID, warehouse_id)
            .andWhere(WAREHOUSE.COLUMNS.MAIN_WAREHOUSE, true)

          if (!otherMain.length) {
            throw CustomError.create({
              httpCode: StatusCodes.NOT_ACCEPTABLE,
              message: "Minimum One Main Warehouse Mandatory",
              code: "NOT_ACCEPTABLE"
            });
          }
        }
      }

      if (body.is_active === false) {
        const checkMapping = await trx(WAREHOUSE_MAPPING.NAME)
          .where(WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID, warehouse_id);

        if (checkMapping.length > 0) {
          throw CustomError.create({
            httpCode: StatusCodes.NOT_ACCEPTABLE,
            message: "Warehouse is already mapped to a user and cannot be deactivated.",
            code: "NOT_ACCEPTABLE"
          });
        }
      }

      const updated = await trx(WAREHOUSE.NAME)
        .where(WAREHOUSE.COLUMNS.ID, warehouse_id)
        .update({
          [WAREHOUSE.COLUMNS.WAREHOUSE_NAME]: String(body.warehouse_name).trim(),
          [WAREHOUSE.COLUMNS.SHORT_NAME]: String(body.short_name).trim(),
          [WAREHOUSE.COLUMNS.ADD1]: body.add1,
          [WAREHOUSE.COLUMNS.ADD2]: body.add2,
          [WAREHOUSE.COLUMNS.ADD3]: body.add3,
          [WAREHOUSE.COLUMNS.ADD4]: body.add4,
          [WAREHOUSE.COLUMNS.CITYID]: body.city,
          [WAREHOUSE.COLUMNS.PINCODE]: body.pincode,
          [WAREHOUSE.COLUMNS.STATEID]: body.state,
          [WAREHOUSE.COLUMNS.COUNTRYID]: body.country,
          [WAREHOUSE.COLUMNS.PHONE]: body.phone,
          [WAREHOUSE.COLUMNS.MOBILE]: body?.mobile ? String(body.mobile) : null,
          [WAREHOUSE.COLUMNS.EMAIL]: body.email,
          [WAREHOUSE.COLUMNS.COMPANY_ID]: body.company_id,
          [WAREHOUSE.COLUMNS.IS_ACTIVE]: body.is_active,
          [WAREHOUSE.COLUMNS.CREATED_BY]: userDetails.id,
          [WAREHOUSE.COLUMNS.LIMITATION]: body.limitation,
          [WAREHOUSE.COLUMNS.GSTIN]: body.gstin,
          [WAREHOUSE.COLUMNS.FSSAI]: body.fssai,
          [WAREHOUSE.COLUMNS.ISGST]: body.is_gst,
          [WAREHOUSE.COLUMNS.BANKACNO]: body.bankacno,
          [WAREHOUSE.COLUMNS.BANKNAME]: body.bankname,
          [WAREHOUSE.COLUMNS.ACNAME]: body.acname,
          [WAREHOUSE.COLUMNS.IFSCCODE]: body.ifsccode,
          [WAREHOUSE.COLUMNS.WALLET_BALANCE]: body.wallet_balance,
          [WAREHOUSE.COLUMNS.MAIN_WAREHOUSE]: body.main_warehouse,
          [WAREHOUSE.COLUMNS.CONTACT_NAME]: body.contact_name
        });

      if (!updated) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while updating Warehouse",
          code: "NOT_IMPLEMENTED"
        });
      }

      // Update Warehouse Company Mapping
      if (body.company_details?.length) {
        await trx(WAREHOUSE_COMPANY_MAPPING.NAME)
          .where(WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID, warehouse_id)
          .update({
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.IS_ACTIVE]: false,
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.UPDATED_BY]: userDetails.id,
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.UPDATED_AT]: knex.fn.now()
          });

        const [{ max_id }] = await trx(WAREHOUSE_COMPANY_MAPPING.NAME).max("id as max_id");
        let nextId = (max_id || 0) + 1;

        const entries = body.company_details.map((company, index) => ({
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.ID]: nextId + index,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID]: company.company_id,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID]: warehouse_id,
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.CREATED_AT]: new Date(),
          [WAREHOUSE_COMPANY_MAPPING.COLUMNS.CREATED_BY]: userDetails.id
        }));

        await trx(WAREHOUSE_COMPANY_MAPPING.NAME)
          .insert(entries)
          .onConflict([
            WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID,
            WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID
          ])
          .merge({
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID]: trx.raw("excluded.warehouse_id"),
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID]: trx.raw("excluded.company_id"),
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.CREATED_BY]: trx.raw("excluded.created_by"),
            [WAREHOUSE_COMPANY_MAPPING.COLUMNS.IS_ACTIVE]: trx.raw("excluded.is_active")
          });
      }

      await trx(WAREHOUSE_LOGS.NAME).insert({
        [WAREHOUSE_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
        [WAREHOUSE_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [WAREHOUSE_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [WAREHOUSE_LOGS.COLUMNS.WAREHOUSE_ID]: warehouse_id,
        [WAREHOUSE_LOGS.COLUMNS.WAREHOUSE_NAME]: String(body.warehouse_name).trim()
      });

      await trx.commit();
      return { success: true };

    } catch (error) {
      // Rollback on error
      await trx.rollback(); // Rollback transaction if any error occurs

      console.error("Transaction Failed:", error);

      // ✅ Catch and return structured error to the frontend
      if (error instanceof CustomError) {
        console.log(error, "error message");
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: error._errors[0].message || "Something went wrong",
          property: "",
          code: "NOT_FOUND"
        });
      } else {
        throw {
          statusCode: 500,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR"
        };
      }
    }
  }


  async function deleteWareHouse({ body, logTrace, params }) {
    const knex = this;
    const { warehouse_id } = params;
    const main_warehouse_query = knex(WAREHOUSE.NAME)
      .where(WAREHOUSE.COLUMNS.MAIN_WAREHOUSE, true)
      .where(WAREHOUSE.COLUMNS.ID, warehouse_id)
    const main_warehouse_response = await main_warehouse_query;

    if (main_warehouse_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Main Warehouse cann't be deleted.",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const validationUserQuery = knex(WAREHOUSE_MAPPING.NAME)
      .where(WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID, warehouse_id)

    const existsWarehouseMapping = await validationUserQuery;

    if (existsWarehouseMapping.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Warehouse Mapped With User cann't be deleted ",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const main_warehouse_query1 = knex(PURCHASE_FMCG_MASTER.NAME)
      .where(PURCHASE_FMCG_MASTER.COLUMNS.WAREHOUSE_ID, warehouse_id)

    const main_warehouse_response1 = await main_warehouse_query1;

    if (main_warehouse_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Warehouse Mapped With Purchase",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query = knex(WAREHOUSE.NAME)
      .where(WAREHOUSE.COLUMNS.ID, warehouse_id)

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Warehouse not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(WAREHOUSE.NAME)
      .where(WAREHOUSE.COLUMNS.ID, warehouse_id)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "delete WAREHOUSE",
      logTrace
    });

    const response = await query_delete;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "WAREHOUSE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return { success: true };
  }
  async function getWareHouseInfo({ params, logTrace }) {
    const knex = this;
    const { warehouse_id } = params;
    const query = knex
      .select([
        `${WAREHOUSE.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(`${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`, warehouse_id)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get WAREHOUSE Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "WAREHOUSE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  async function getCompanyDetailsByIdRepo({ queryString, params, logTrace, userDetails }) {
    const knex = this;
    const { warehouse_id } = params;
    const user_id = userDetails.id;

    const query = knex
      .distinct([
        `${COMPANY.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${WAREHOUSE_COMPANY_MAPPING.NAME} as ${WAREHOUSE_COMPANY_MAPPING.NAME}`)
      .leftJoin(
        `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
        `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY_USER_MAPPING.NAME} as ${COMPANY_USER_MAPPING.NAME}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`,
        `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID}`
      ) // ✅ Missing JOIN added here
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .where(`${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.WAREHOUSE_ID}`, warehouse_id)
      .where(`${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.USER_ID}`, user_id)
      .where(`${WAREHOUSE_COMPANY_MAPPING.NAME}.${WAREHOUSE_COMPANY_MAPPING.COLUMNS.IS_ACTIVE}`, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Warehouse Info",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Company details not Found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }


  async function getWarehouseListByIdRepo({ queryString, params, logTrace, userDetails }) {
    const knex = this;
    const { id } = userDetails;
    const query = knex
      .distinct([
        `${WAREHOUSE.NAME}.*`,
        knex.raw(
          `jsonb_build_object('id', ${STATES.NAME}.${STATES.COLUMNS.ID}, 'name', ${STATES.NAME}.${STATES.COLUMNS.NAME}) as state`
        ),
        knex.raw(
          `jsonb_build_object('id', ${CITIES.NAME}.${CITIES.COLUMNS.ID}, 'name', ${CITIES.NAME}.${CITIES.COLUMNS.NAME}) as city`
        ),
        knex.raw(
          `jsonb_build_object('id', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}, 'name', ${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME}) as country`
        )
      ])
      .from(`${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.STATEID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COUNTRYID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .leftJoin(
        `${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`,
        `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`
      )
      .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`, id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Warehouse Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Warehouse not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getWarehouseCityWise({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .distinct([
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID} as city_id`,
        `${WAREHOUSE.NAME}.*`
      ])
      .from(`${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`)
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.CITYID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .orderBy(`${CITIES.NAME}.${CITIES.COLUMNS.NAME}`, "ASC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Warehouse Cities",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "warehouse not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  async function getRegionRepo({ body, params, logTrace }) {
    const knex = this;

    const query = knex
      .select('*')
      .from(`${REGION.NAME} as ${REGION.NAME}`)
      .orderBy(`${REGION.NAME}.${REGION.COLUMNS.REGION_NAME}`, 'ASC');

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Regions",
      logTrace
    });

    // Execute query
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Regions not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }


  async function getWarehouseProductRepo({ body, params, logTrace }) {
    const knex = this;
    const { product_code } = params
    const query = knex
      .select([
        `${ITEM.NAME}.${ITEM.COLUMNS.ID} as product_id`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_NAME} as product_name`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE} as product_code`,
        `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.BALENCE_STOCK} as warehouse_product_balance`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID} as uom_id`,
        `${UNITS.NAME}.${UNITS.COLUMNS.UNITS_SHORT_NAME} as unit_short_name`
      ])
      .from(`${WAREHOUSE_PRODUCTS_MAPPING.NAME} as ${WAREHOUSE_PRODUCTS_MAPPING.NAME}`)
      .innerJoin(
        `${ITEM.NAME} as ${ITEM.NAME}`,
        `${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.PRODUCT_CODE}`
      )
      .innerJoin(
        `${UNITS.NAME} as ${UNITS.NAME}`,
        `${ITEM.NAME}.${ITEM.COLUMNS.UOM_ID}`,
        `${UNITS.NAME}.${UNITS.COLUMNS.ID}`
      )
      .where(`${WAREHOUSE_PRODUCTS_MAPPING.NAME}.${WAREHOUSE_PRODUCTS_MAPPING.COLUMNS.PRODUCT_CODE}`, product_code)
      .first();


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier list",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "supplier list data not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  return {
    getWareHouse,
    getWareHousePaginate,
    postWareHouse,
    putWareHouse,
    deleteWareHouse,
    getWareHouseInfo,
    getCompanyDetailsByIdRepo,
    getWarehouseListByIdRepo,
    getWarehouseCityWise,
    getRegionRepo,
    getWarehouseProductRepo
  };
}

module.exports = wareHouseRepo;
