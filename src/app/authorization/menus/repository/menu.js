const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MENU, SUBMENU, MENU_AUTH } = require("../commons/constants");

function menuRepo(fastify) {
  async function getMenu({ body, params, logTrace, query_string }) {
    const knex = this;
    const { search } = query_string;
    const query = knex(MENU.NAME)
      .where(`${MENU.NAME}.${MENU.COLUMNS.COMPANY_ID}`, 1)
      .orderBy(
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`, "asc"
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Menus",
      logTrace
    });

    if (search && search.length >= 1) {
      query.where(function () {
        this.where(`${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`, "ilike", `%${search}%`)
      });

    }

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
        message: "Customers not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function postMenu({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { warehouse_type } = body;
    const query = knex(MENU.NAME)
      .where(MENU.COLUMNS.MENU_NAME, "ilike", String(body.menu_name))
    if (Number(warehouse_type) == 0) {
      query.where(MENU.COLUMNS.IS_OUTLET, true)
    }
    if (Number(warehouse_type) == 1) {
      query.where(MENU.COLUMNS.IS_WAREHOUSE, true)
    }

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu already exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${MENU.NAME}`).insert({
      [MENU.COLUMNS.MENU_NAME]: body.menu_name,
      [MENU.COLUMNS.MENU_ICON]: body.menu_icon,
      [MENU.COLUMNS.MENU_URL]: body.menu_url,
      [MENU.COLUMNS.MENU_ORDER]: body.menu_order,
      [MENU.COLUMNS.COMPANY_ID]: body.company_id,
      [MENU.COLUMNS.IS_OUTLET]: Number(body.warehouse_type) === 0 || Number(body.warehouse_type) === 2,
      [MENU.COLUMNS.IS_WAREHOUSE]: Number(body.warehouse_type) === 1 || Number(body.warehouse_type) === 2,
      [MENU.COLUMNS.IS_ACTIVE]: body.is_active,
      [MENU.COLUMNS.CREATED_BY]: created_by,
      [MENU.COLUMNS.UPDATED_BY]: created_by
    });

    const response = await query_insert;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Menus",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putMenu({ menu_id, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { warehouse_type } = body;
    const query_check = knex(MENU.NAME)
      .whereNot(MENU.COLUMNS.ID, menu_id)
      .andWhere(function () {
        this.where(MENU.COLUMNS.MENU_NAME, "ilike", String(body.menu_name));
      })
    if (Number(warehouse_type) == 0) {
      query_check.where(MENU.COLUMNS.IS_OUTLET, true)
    }
    if (Number(warehouse_type) == 1) {
      query_check.where(MENU.COLUMNS.IS_WAREHOUSE, true)
    }


    const check_response = await query_check;

    if (check_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "This menu name already exsists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex(MENU.NAME)
      .where(MENU.COLUMNS.ID, menu_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${MENU.NAME}`)
      .where(`${MENU.COLUMNS.ID}`, menu_id)
      .update({
        [MENU.COLUMNS.MENU_NAME]: body.menu_name,
        [MENU.COLUMNS.MENU_ICON]: body.menu_icon,
        [MENU.COLUMNS.MENU_URL]: body.menu_url,
        [MENU.COLUMNS.MENU_ORDER]: body.menu_order,
        [MENU.COLUMNS.COMPANY_ID]: body.company_id,
        [MENU.COLUMNS.IS_OUTLET]: Number(warehouse_type) === 0 || Number(warehouse_type) === 2,
        [MENU.COLUMNS.IS_WAREHOUSE]: Number(warehouse_type) === 1 || Number(warehouse_type) === 2,
        [MENU.COLUMNS.IS_ACTIVE]: body.is_active,
        [MENU.COLUMNS.UPDATED_BY]: created_by,
        [MENU.COLUMNS.UPDATED_AT]: new Date()
      });

    const response = await query_update;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating Menus",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const existingSubmenuIds = await knex(SUBMENU.NAME)
      .where(SUBMENU.COLUMNS.MENU_ID, menu_id)
    console.log(existingSubmenuIds, "submenu ids")

    if (existingSubmenuIds.length > 0) {
      // Update existing record
      await knex(SUBMENU.NAME)
        .where(SUBMENU.COLUMNS.MENU_ID, menu_id)
        .update({
          [SUBMENU.COLUMNS.IS_ACTIVE]: body.is_active,
        });

      // Update existing record
      await knex(MENU_AUTH.NAME)
        .where(MENU_AUTH.COLUMNS.MENU_ID, menu_id)
        .update({
          [MENU_AUTH.COLUMNS.IS_ACTIVE]: body.is_active,
        });
    }


    return { success: true };
  }

  async function deleteMenu({ menu_id, body, logTrace, params }) {
    const knex = this;
    const query = knex(MENU.NAME)
      .where(MENU.COLUMNS.ID, menu_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(SUBMENU.NAME)
      .where(SUBMENU.COLUMNS.MENU_ID, menu_id);

    const exists_response1 = await query1;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu is mapped with a submenu and cannot be deleted",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(MENU.NAME).where(MENU.COLUMNS.ID, menu_id).del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete Menu",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Menu not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const query_delete1 = await knex(MENU_AUTH.NAME)
      .where(MENU_AUTH.COLUMNS.MENU_ID, menu_id)
      .del();

    return { success: true };
  }

  async function menuList({ body, params, logTrace }) {
    const knex = this;
    const query = knex(MENU.NAME)
      .where(
        MENU.COLUMNS.COMPANY_ID,
        params.company_id
      )
      .where(
        MENU.COLUMNS.IS_ACTIVE,
        true
      )
      .orderBy(
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`, "asc"
      );
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Menus",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Menus not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  return {
    getMenu,
    postMenu,
    putMenu,
    deleteMenu,
    menuList
  };
}

module.exports = menuRepo;
