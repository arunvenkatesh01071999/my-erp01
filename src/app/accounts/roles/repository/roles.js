const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ROLES, ROLE_LOGS, USERS, ROLE_MAPPING } = require("../commons/constants");

function roleRepo(fastify) {
  async function getRole({ body, params, logTrace, queryString }) {
    const knex = this;
    const { search } = queryString;
    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.COMPANY_ID, params.company_id)
      .orderBy(ROLES.COLUMNS.ID, "DESC");

    if (search && search.length >= 1) {
      query.where(ROLES.COLUMNS.ROLE_NAME, "ilike", `%${search}%`);
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Role",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (response.meta.pagination.total_pages < params.current_page) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Requested page is beyond the available data",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Role type not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function getRoleInfo({ body, params, logTrace }) {
    const knex = this;

    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.ID, params.role_id)
      .where(ROLES.COLUMNS.ID, params.company_id)
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Role",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Role not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response[0];
  }
  async function postRole({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { warehouse_type } = body;
    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.ROLE_NAME, 'ilike', String(body.role_name).trim())
      .where(ROLES.COLUMNS.COMPANY_ID, body.company_id)
    if (Number(warehouse_type) == 0) {
      query.where(ROLES.COLUMNS.IS_OUTLET, true)
    }
    if (Number(warehouse_type) == 1) {
      query.where(ROLES.COLUMNS.IS_WAREHOUSE, true)
    }
    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Role Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    const query_insert = await knex(`${ROLES.NAME}`)
      .returning('id')
      .insert({
        [ROLES.COLUMNS.ROLE_NAME]: body.role_name,
        [ROLES.COLUMNS.COMPANY_ID]: body.company_id,
        [ROLES.COLUMNS.IS_OUTLET]: Number(body.warehouse_type) === 0 || Number(body.warehouse_type) === 2,
        [ROLES.COLUMNS.IS_WAREHOUSE]: Number(body.warehouse_type) === 1 || Number(body.warehouse_type) === 2,
        [ROLES.COLUMNS.CREATED_BY]: created_by,
        [ROLES.COLUMNS.UPDATED_BY]: created_by
      });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Role type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    const role_id = response[0].id;
    // Insert log entry
    await knex(ROLE_LOGS.NAME).insert({
      [ROLE_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [ROLE_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [ROLE_LOGS.COLUMNS.ROLE_ID]: role_id,
      [ROLE_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [ROLE_LOGS.COLUMNS.ROLE_NAME]: String(body.role_name).trim()
    });


    return { success: true };
  }

  async function putRole({ role_id, company_id, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.ID, role_id)
      .where(ROLES.COLUMNS.COMPANY_ID, company_id);


    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Role type not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.ROLE_NAME, body.role_name)
      .whereNot(ROLES.COLUMNS.ID, role_id);

    const exists_response1 = await query1;
    console.log(exists_response1, "response1")
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Suppiler Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${ROLES.NAME}`)
      .where(`${ROLES.COLUMNS.ID}`, role_id)
      .update({
        [ROLES.COLUMNS.ROLE_NAME]: body.role_name,
        [ROLES.COLUMNS.COMPANY_ID]: body.company_id,
        [ROLES.COLUMNS.IS_ACTIVE]: body.is_active,
        [ROLES.COLUMNS.IS_OUTLET]: Number(body.warehouse_type) === 0 || Number(body.warehouse_type) === 2,
        [ROLES.COLUMNS.IS_WAREHOUSE]: Number(body.warehouse_type) === 1 || Number(body.warehouse_type) === 2,
        [ROLES.COLUMNS.UPDATED_AT]: new Date(),
        [ROLES.COLUMNS.UPDATED_BY]: created_by
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind Role Type",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update log entry
    await knex(ROLE_LOGS.NAME).insert({
      [ROLE_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [ROLE_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [ROLE_LOGS.COLUMNS.ROLE_ID]: role_id,
      [ROLE_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [ROLE_LOGS.COLUMNS.ROLE_NAME]: String(body.role_name).trim()
    });

    return { success: true };
  }
  async function deleteRole({ role_id, company_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.COMPANY_ID, company_id)
      .where(ROLES.COLUMNS.ID, role_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Role not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const validationquery = knex(ROLE_MAPPING.NAME).
      where(ROLE_MAPPING.COLUMNS.ROLE_ID, role_id);

    const exists_response1 = await validationquery;
    console.log(exists_response1)
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Cannot delete role,Mapped with a purchase.",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.ID, role_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Role ",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Role not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // Delete log entry
    await knex(ROLE_LOGS.NAME).insert({
      [ROLE_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [ROLE_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [ROLE_LOGS.COLUMNS.ROLE_ID]: role_id,
      [ROLE_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [ROLE_LOGS.COLUMNS.ROLE_NAME]: String(exists_response[0].role_name).trim()
    });
    return { success: true };
  }
  async function getRoleList({ body, params, logTrace }) {
    const knex = this;
    const { warehouse_type } = params;
    const query = knex(ROLES.NAME)
      .where(ROLES.COLUMNS.COMPANY_ID, params.company_id)
      .where(ROLES.COLUMNS.IS_ACTIVE, true)
      .orderBy(ROLES.COLUMNS.ID, "DESC");

    if (Number(warehouse_type) == 0) {
      query.where(
        `${ROLES.NAME}.${ROLES.COLUMNS.IS_OUTLET}`,
        true
      );
    }

    if (Number(warehouse_type) == 1) {
      query.where(
        `${ROLES.NAME}.${ROLES.COLUMNS.IS_WAREHOUSE}`,
        true
      );
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Role",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Role type not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }

  return {
    getRole,
    postRole,
    putRole,
    deleteRole,
    getRoleInfo,
    getRoleList
  };
}

module.exports = roleRepo;
