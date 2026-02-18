const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OUTLETMEMBERS } = require("../../commons");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");

function OutletMemberRepo(fastify) {
  async function getOutletMember({ logTrace }) {
    const knex = this;
    // const query = knex(OutletMember.NAME).where(OutletMember.COLUMNS.IS_ACTIVE, "1");
    const query = knex
      .select([
        `${OUTLETMEMBERS.NAME}.*`,
        // `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        // `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        // `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${OUTLETMEMBERS.NAME} as ${OUTLETMEMBERS.NAME}`)
      // .leftJoin(
      //   `${STATES.NAME} as ${STATES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.STATE}`,
      //   `${STATES.NAME}.${STATES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${CITIES.NAME} as ${CITIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.CITY}`,
      //   `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.COUNTRY}`,
      //   `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      // )
      .orderBy(OUTLETMEMBERS.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get OutletMember",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OutletMember not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getOutletMemberPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${OUTLETMEMBERS.NAME}.*`,

      ])
      .from(`${OUTLETMEMBERS.NAME} as ${OUTLETMEMBERS.NAME}`)
      // .leftJoin(
      //   `${STATES.NAME} as ${STATES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.STATE}`,
      //   `${STATES.NAME}.${STATES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${CITIES.NAME} as ${CITIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.CITY}`,
      //   `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.COUNTRY}`,
      //   `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      // )
      .orderBy(OUTLETMEMBERS.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.PARTY_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
          .orWhere(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.SPOUSE_NAME}`, "ilike", `%${search}%`)
      });
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get OutletMember",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OutletMember not found",
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
  async function postOutletMember({ params, body, logTrace, userDetails }) {
    const knex = this;

    const query = knex(OUTLETMEMBERS.NAME).where(OUTLETMEMBERS.COLUMNS.MOBILE, body.mobile);

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OutletMember Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${OUTLETMEMBERS.NAME}`).insert({
      [OUTLETMEMBERS.COLUMNS.MOBILE]: body.mobile,
      [OUTLETMEMBERS.COLUMNS.PARTY_NAME]: body.party_name,
      [OUTLETMEMBERS.COLUMNS.ADDRESS]: body.address,
      [OUTLETMEMBERS.COLUMNS.SPOUSE_NAME]: body.spouse_name,
      [OUTLETMEMBERS.COLUMNS.SPOUSE_DOB]: body.spouse_dob,
      [OUTLETMEMBERS.COLUMNS.PARTY_DOB]: body.party_dob,
      [OUTLETMEMBERS.COLUMNS.ANNIVERSARY_DATE]: body.anniversary_date,
      [OUTLETMEMBERS.COLUMNS.NO_OF_CHILD]: body.no_of_child,
      [OUTLETMEMBERS.COLUMNS.IS_ACTIVE]: body.is_active

    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating OutletMember",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putOutletMember({ id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OUTLETMEMBERS.NAME).where(OUTLETMEMBERS.COLUMNS.ID, id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OutletMember not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${OUTLETMEMBERS.NAME}`)
      .where(`${OUTLETMEMBERS.COLUMNS.ID}`, id)
      .update({
        [OUTLETMEMBERS.COLUMNS.MOBILE]: body.mobile,
        [OUTLETMEMBERS.COLUMNS.PARTY_NAME]: body.party_name,
        [OUTLETMEMBERS.COLUMNS.ADDRESS]: body.address,
        [OUTLETMEMBERS.COLUMNS.SPOUSE_NAME]: body.spouse_name,
        [OUTLETMEMBERS.COLUMNS.SPOUSE_DOB]: body.spouse_dob,
        [OUTLETMEMBERS.COLUMNS.PARTY_DOB]: body.party_dob,
        [OUTLETMEMBERS.COLUMNS.ANNIVERSARY_DATE]: body.anniversary_date,
        [OUTLETMEMBERS.COLUMNS.NO_OF_CHILD]: body.no_of_child,
        [OUTLETMEMBERS.COLUMNS.IS_ACTIVE]: body.is_active

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating  OutletMember",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteOutletMember({ id, body, logTrace }) {
    const knex = this;

    const query = knex(OUTLETMEMBERS.NAME).where(OUTLETMEMBERS.COLUMNS.ID, id).del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete OutletMember",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OutletMember not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getOutletMemberInfo({ params, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${OUTLETMEMBERS.NAME}.*`,
        // `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        // `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        // `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${OUTLETMEMBERS.NAME} as ${OUTLETMEMBERS.NAME}`)
      // .leftJoin(
      //   `${STATES.NAME} as ${STATES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.STATE}`,
      //   `${STATES.NAME}.${STATES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${CITIES.NAME} as ${CITIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.CITY}`,
      //   `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      // )
      // .leftJoin(
      //   `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
      //   `${OutletMember.NAME}.${OutletMember.COLUMNS.COUNTRY}`,
      //   `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      // )
      .where(`${OUTLETMEMBERS.NAME}.${OUTLETMEMBERS.COLUMNS.ID}`, params.id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get OutletMember Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OutletMember not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getOutletMember,
    getOutletMemberPaginate,
    postOutletMember,
    putOutletMember,
    deleteOutletMember,
    getOutletMemberInfo
  };
}

module.exports = OutletMemberRepo;
