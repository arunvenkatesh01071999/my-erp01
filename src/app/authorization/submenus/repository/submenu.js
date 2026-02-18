const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MENU, MENU_AUTH } = require("../../menus/commons/constants");
const { SUBMENU } = require("../../menus/commons/constants");

function submenuRepo(fastify) {
  async function getSubMenu({ body, params, logTrace, query_string }) {
    const knex = this;
    const { search } = query_string;
    const query = knex
      .select([
        `${SUBMENU.NAME}.*`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`,
        knex.raw(
          `to_jsonb(${MENU.NAME}.*) as menu_id`
        )
      ])
      .from(`${SUBMENU.NAME} as ${SUBMENU.NAME}`)
      .leftJoin(
        `${MENU.NAME} as ${MENU.NAME}`,
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.MENU_ID}`,
        `${MENU.NAME}.${MENU.COLUMNS.ID}`
      )
      .where(
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.COMPANY_ID}`,
        params.company_id
      )
      .orderBy(`${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`, "asc")
      .orderBy(`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_ORDER}`, "asc");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SubMenus",
      logTrace
    });

    if (search && search.length >= 3) {
      query.where(SUBMENU.COLUMNS.SUBMENU_NAME, "ilike", `%${search}%`)
        .orWhere(MENU.COLUMNS.MENU_NAME, "ilike", `%${search}%`)
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
        message: "Sub menus not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    return response;
  }
  async function postSubMenu({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const query = knex(SUBMENU.NAME)
      .where(
        SUBMENU.COLUMNS.MENU_ID, body.menu_id
      ).andWhere(
        SUBMENU.COLUMNS.SUBMENU_NAME, "ilike",
        String(body.sub_menu_name)
      );

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubMenu already exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    console.log(body.sub_menu_order, body.menu_id)
    const menu_order_query = knex(SUBMENU.NAME)
      .where(
        SUBMENU.COLUMNS.SUBMENU_ORDER,
        Number(body.sub_menu_order)
      )
      .andWhere(
        SUBMENU.COLUMNS.MENU_ID,
        Number(body.menu_id)
      )

    const exists_response1 = await menu_order_query;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubMenu order number already exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${SUBMENU.NAME}`).insert({
      [SUBMENU.COLUMNS.MENU_ID]: body.menu_id,
      [SUBMENU.COLUMNS.SUBMENU_NAME]: body.sub_menu_name,
      [SUBMENU.COLUMNS.SUBMENU_URL]: body.sub_menu_url,
      [SUBMENU.COLUMNS.SUBMENU_ORDER]: body.sub_menu_order,
      [SUBMENU.COLUMNS.COMPANY_ID]: body.company_id,
      [SUBMENU.COLUMNS.IS_OUTLET]: Number(body.warehouse_type) === 0 || Number(body.warehouse_type) === 2,
      [SUBMENU.COLUMNS.IS_WAREHOUSE]: Number(body.warehouse_type) === 1 || Number(body.warehouse_type) === 2,
      [SUBMENU.COLUMNS.CREATED_BY]: created_by,
      [SUBMENU.COLUMNS.CREATED_AT]: new Date()
    });

    const response = await query_insert;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating SubMenus",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }
  async function putSubMenu({ submenu_id, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;

    const query_check = knex(SUBMENU.NAME)
      .whereNot(SUBMENU.COLUMNS.ID, submenu_id)
      .andWhere(
        SUBMENU.COLUMNS.MENU_ID,
        Number(body.menu_id)
      )
      .andWhere(function () {
        this.where(SUBMENU.COLUMNS.SUBMENU_NAME, "ilike", String(body.sub_menu_name));
      });

    const check_response = await query_check;

    if (check_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "This submenu name already exits",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const menu_order_query = knex(SUBMENU.NAME)
      .whereNot(SUBMENU.COLUMNS.ID, submenu_id)
      .where(
        SUBMENU.COLUMNS.SUBMENU_ORDER,
        Number(body.sub_menu_order)
      )
      .andWhere(
        SUBMENU.COLUMNS.MENU_ID,
        Number(body.menu_id)
      )

    const exists_response1 = await menu_order_query;

    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "SubMenu order number already exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex(SUBMENU.NAME)
      .where(SUBMENU.COLUMNS.ID, submenu_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${SUBMENU.NAME}`)
      .where(`${SUBMENU.COLUMNS.ID}`, submenu_id)
      .update({
        [SUBMENU.COLUMNS.MENU_ID]: body.menu_id,
        [SUBMENU.COLUMNS.SUBMENU_NAME]: body.sub_menu_name,
        [SUBMENU.COLUMNS.SUBMENU_URL]: body.sub_menu_url,
        [SUBMENU.COLUMNS.SUBMENU_ORDER]: body.sub_menu_order,
        [SUBMENU.COLUMNS.COMPANY_ID]: body.company_id,
        [SUBMENU.COLUMNS.IS_OUTLET]: Number(body.warehouse_type) === 0 || Number(body.warehouse_type) === 2,
        [SUBMENU.COLUMNS.IS_WAREHOUSE]: Number(body.warehouse_type) === 1 || Number(body.warehouse_type) === 2,
        [SUBMENU.COLUMNS.IS_ACTIVE]: body.is_active,
        [SUBMENU.COLUMNS.UPDATED_BY]: created_by,
        [SUBMENU.COLUMNS.UPDATED_AT]: new Date()
      });

    const response = await query_update;

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating SubMenus",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update existing record
    const query_update1 = await knex(MENU_AUTH.NAME)
      .where(MENU_AUTH.COLUMNS.SUBMENU_ID, submenu_id)
      .update({
        [MENU_AUTH.COLUMNS.MENU_ID]: body.menu_id,
        [MENU_AUTH.COLUMNS.IS_ACTIVE]: body.is_active
      });

    return { success: true };
  }

  async function deleteSubMenu({ submenu_id, body, logTrace, params }) {
    const knex = this;
    const query = knex(SUBMENU.NAME)
      .where(SUBMENU.COLUMNS.COMPANY_ID, params.company_id)
      .where(SUBMENU.COLUMNS.ID, submenu_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Menu not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(SUBMENU.NAME)
      .where(SUBMENU.COLUMNS.ID, submenu_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete SubMenu",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SubMenu not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    // const query_delete1 = await knex(ROLE_MAPPING.NAME)
    //   .where(ROLE_MAPPING.COLUMNS.USER_ID, user_id)
    //   .where(ROLE_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
    //   .del();
    // const query_delete2 = await knex(OUTLET_MAPPING.NAME)
    //   .where(OUTLET_MAPPING.COLUMNS.USER_ID, user_id)
    //   .where(OUTLET_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
    //   .del();
    return { success: true };
  }
  async function submenuList({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([`${SUBMENU.NAME}.*`, `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`])
      .from(`${SUBMENU.NAME} as ${SUBMENU.NAME}`)
      .leftJoin(
        `${MENU.NAME} as ${MENU.NAME}`,
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.MENU_ID}`,
        `${MENU.NAME}.${MENU.COLUMNS.ID}`
      )
      .where(
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.COMPANY_ID}`,
        params.company_id
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
    getSubMenu,
    postSubMenu,
    putSubMenu,
    deleteSubMenu,
    submenuList
  };
}

module.exports = submenuRepo;
