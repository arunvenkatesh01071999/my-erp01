const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { PACKING_EMPLOYEE, PACKING_EMPLOYEE_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");

function PackingEmployeeRepo(fastify) {

  async function getPackingEmployee({ logTrace }) {
    const knex = this;
    const query = knex(PACKING_EMPLOYEE.NAME).where(PACKING_EMPLOYEE.COLUMNS.IS_ACTIVE, "1").orderBy(PACKING_EMPLOYEE.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get PACKING_EMPLOYEE",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PACKING_EMPLOYEE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getPackingEmployeePaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex(PACKING_EMPLOYEE.NAME).orderBy(PACKING_EMPLOYEE.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${PACKING_EMPLOYEE.NAME}.${PACKING_EMPLOYEE.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${PACKING_EMPLOYEE.NAME}.${PACKING_EMPLOYEE.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length > 0) {
      query.where(function () {
        this.where(PACKING_EMPLOYEE.COLUMNS.NAME, "ilike", `%${search}%`)
          .orWhere(PACKING_EMPLOYEE.COLUMNS.MOBILE_NUMBER, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get PACKING_EMPLOYEE",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PACKING_EMPLOYEE not found",
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


  async function postPackingEmployee({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PACKING_EMPLOYEE.NAME)
      .where(PACKING_EMPLOYEE.COLUMNS.NAME, body.name);
    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PackingEmployee Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    console.log(body);
    const query_insert = await knex(`${PACKING_EMPLOYEE.NAME}`)
      .returning(['id'])
      .insert({
        [PACKING_EMPLOYEE.COLUMNS.NAME]: body.name,
        [PACKING_EMPLOYEE.COLUMNS.CITY]: body.city,
        [PACKING_EMPLOYEE.COLUMNS.MOBILE_NUMBER]: body.mobile_number,
        [PACKING_EMPLOYEE.COLUMNS.COMPANY_ID]: userDetails.company_id,
        [PACKING_EMPLOYEE.COLUMNS.IS_ACTIVE]: body.is_active,
        [PACKING_EMPLOYEE.COLUMNS.CREATED_AT]: new Date(),
        [PACKING_EMPLOYEE.COLUMNS.CREATED_BY]: userDetails.id


      });


    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating PACKING_EMPLOYEE",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putPackingEmployee({ id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PACKING_EMPLOYEE.NAME).where(PACKING_EMPLOYEE.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PackingEmployee not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${PACKING_EMPLOYEE.NAME}`)
      .where(`${PACKING_EMPLOYEE.COLUMNS.ID}`, id)
      .update({
        [PACKING_EMPLOYEE.COLUMNS.NAME]: body.name,
        [PACKING_EMPLOYEE.COLUMNS.CITY]: body.city,
        [PACKING_EMPLOYEE.COLUMNS.MOBILE_NUMBER]: body.mobile_number,
        [PACKING_EMPLOYEE.COLUMNS.COMPANY_ID]: userDetails.company_id,
        [PACKING_EMPLOYEE.COLUMNS.IS_ACTIVE]: body.is_active,
        [PACKING_EMPLOYEE.COLUMNS.UPDATED_AT]: new Date(),
        [PACKING_EMPLOYEE.COLUMNS.UPDATED_BY]: userDetails.id

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind PACKING_EMPLOYEE",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function deletePackingEmployee({ id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(PACKING_EMPLOYEE.NAME).where(PACKING_EMPLOYEE.COLUMNS.ID, id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "PackingEmployee not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(PACKING_EMPLOYEE.NAME)
      .where(PACKING_EMPLOYEE.COLUMNS.ID, id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete PACKING_EMPLOYEE",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PACKING_EMPLOYEE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }
  async function getPackingEmployeeInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(PACKING_EMPLOYEE.NAME).where(PACKING_EMPLOYEE.COLUMNS.ID, params.id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get PACKING_EMPLOYEE Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "PACKING_EMPLOYEE not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getPackingEmployee,
    postPackingEmployee,
    putPackingEmployee,
    deletePackingEmployee,
    getPackingEmployeeInfo,
    getPackingEmployeePaginate
  };
}

module.exports = PackingEmployeeRepo;
