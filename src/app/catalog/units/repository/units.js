const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { UNITS, UNITS_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");

function unitRepo(fastify) {
  async function getUnit({ logTrace }) {
    const knex = this;
    const query = knex(UNITS.NAME).where(UNITS.COLUMNS.IS_ACTIVE, "1").orderBy(UNITS.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get UNITS",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "UNITS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getUnitPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex(UNITS.NAME).orderBy(UNITS.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${UNITS.NAME}.${UNITS.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${UNITS.NAME}.${UNITS.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(UNITS.COLUMNS.UNITS_SHORT_NAME, "ilike", `%${search}%`)
          .orWhere(UNITS.COLUMNS.UNITS_LONG_NAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get UNITS",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "UNITS not found",
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
  async function postUnit({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(UNITS.NAME)
      .where(UNITS.COLUMNS.UNITS_SHORT_NAME, body.units_short_name)
      .orWhere(UNITS.COLUMNS.UNITS_LONG_NAME, body.units_long_name);

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Unit Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    console.log(body);
    const query_insert = await knex(`${UNITS.NAME}`)
      .returning(['id']) // Fixed `retrning` typo
      .insert({
        [UNITS.COLUMNS.UNITS_SHORT_NAME]: body.units_short_name,
        [UNITS.COLUMNS.UNITS_LONG_NAME]: body.units_long_name,
        [UNITS.COLUMNS.COMPANY_ID]: body.company_id,
        [UNITS.COLUMNS.IS_ACTIVE]: body.is_active
      });


    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating units",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedUnitsId = query_insert[0].id;

    // Insert log entry
    await knex(UNITS_LOGS.NAME).insert({
      [UNITS_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [UNITS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [UNITS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [UNITS_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [UNITS_LOGS.COLUMNS.UNIT_ID]: insertedUnitsId,
      [UNITS_LOGS.COLUMNS.UNITS_SHORT_NAME]: String(body.units_short_name).trim(),
      [UNITS_LOGS.COLUMNS.UNITS_LONG_NAME]: String(body.units_long_name).trim()
    });

    return { success: true };
  }
  async function putUnit({ unit_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(UNITS.NAME).where(UNITS.COLUMNS.ID, unit_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Unit not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${UNITS.NAME}`)
      .where(`${UNITS.COLUMNS.ID}`, unit_id)
      .update({
        [UNITS.COLUMNS.UNITS_SHORT_NAME]: body.units_short_name,
        [UNITS.COLUMNS.UNITS_LONG_NAME]: body.units_long_name,
        [UNITS.COLUMNS.COMPANY_ID]: body.company_id,
        [UNITS.COLUMNS.IS_ACTIVE]: body.is_active,
        [UNITS.COLUMNS.UPDATED_AT]: new Date()
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind UNITS",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // UPDATE log entry
    await knex(UNITS_LOGS.NAME).insert({
      [UNITS_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [UNITS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [UNITS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [UNITS_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [UNITS_LOGS.COLUMNS.UNIT_ID]: unit_id,
      [UNITS_LOGS.COLUMNS.UNITS_SHORT_NAME]: String(body.units_short_name).trim(),
      [UNITS_LOGS.COLUMNS.UNITS_LONG_NAME]: String(body.units_long_name).trim()
    });

    return { success: true };
  }
  async function deleteUnit({ unit_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(UNITS.NAME).where(UNITS.COLUMNS.ID, unit_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Unit not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(ITEM.NAME).where(
      ITEM.COLUMNS.UOM_ID,
      unit_id
    );

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Unit is mapped with a product and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(UNITS.NAME)
      .where(UNITS.COLUMNS.ID, unit_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete UNITS",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "UNITS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(UNITS_LOGS.NAME).insert({
      [UNITS_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [UNITS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [UNITS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [UNITS_LOGS.COLUMNS.UNIT_ID]: unit_id,
      [UNITS_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [UNITS_LOGS.COLUMNS.UNITS_SHORT_NAME]: exists_response[0]?.units_short_name
        ? String(exists_response[0].units_short_name).trim()
        : null,
      [UNITS_LOGS.COLUMNS.UNITS_LONG_NAME]: exists_response[0]?.units_long_name
        ? String(exists_response[0].units_long_name).trim()
        : null,
    });
    return { success: true };
  }
  async function getUnitInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(UNITS.NAME).where(UNITS.COLUMNS.ID, params.unit_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get UNITS Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "UNITS not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getUnit,
    postUnit,
    putUnit,
    deleteUnit,
    getUnitInfo,
    getUnitPaginate
  };
}

module.exports = unitRepo;
