const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { MENU } = require("../../menus/commons/constants");
const { SUBMENU } = require("../../menus/commons/constants");
const { MENU_AUTH } = require("../../menus/commons/constants");
const { USERS, ROLE_MAPPING, ROLES } = require("../commons/constants");
const { it } = require("tap/lib/mocha.js");

function menuAuthRepo(fastify) {

  async function postMenuAuth({ body, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    const { user_id, menu_auth_details } = body;

    // Fetch user type
    const userTypeResponse = await knex(USERS.NAME)
      .where(USERS.COLUMNS.ID, user_id)
      .select(USERS.COLUMNS.USER_TYPE)
      .first();

    if (!userTypeResponse) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const { user_type } = userTypeResponse;

    // Fetch roles based on user type
    let query = knex(ROLE_MAPPING.NAME)
      .where(ROLE_MAPPING.COLUMNS.USER_ID, user_id)
      .select(ROLE_MAPPING.COLUMNS.ROLE_ID);

    if (user_type === 0) {
      query = query.andWhere(ROLE_MAPPING.COLUMNS.IS_OUTLET, true);
    } else if (user_type === 1) {
      query = query.andWhere(ROLE_MAPPING.COLUMNS.IS_WAREHOUSE, true);
    } else if (user_type === 2) {
      query = query.andWhere(builder => {
        builder
          .where(ROLE_MAPPING.COLUMNS.IS_OUTLET, true)
          .orWhere(ROLE_MAPPING.COLUMNS.IS_WAREHOUSE, true);
      });
    }

    const roleMappings = await query;

    if (!roleMappings.length) {
      throw new Error(`No roles found for user ID ${user_id}`);
    }

    const roleIds = roleMappings.map(role => role.role_id);

    // Remove duplicate menu auth entries by considering user_id, menu_id, submenu_id, company_id, and role_id
    const uniqueMenuAuthDetails = new Map();

    menu_auth_details.forEach(item => {
      roleIds.forEach(role_id => {
        const key = `${user_id}-${item.menu_id}-${item.submenu_id}-${item.company_id}-${role_id}`;

        if (!uniqueMenuAuthDetails.has(key)) {
          uniqueMenuAuthDetails.set(key, {
            [MENU_AUTH.COLUMNS.ROLE_ID]: role_id,
            [MENU_AUTH.COLUMNS.MENU_ID]: item.menu_id,
            [MENU_AUTH.COLUMNS.SUBMENU_ID]: item.submenu_id,
            [MENU_AUTH.COLUMNS.COMPANY_ID]: item.company_id,
            [MENU_AUTH.COLUMNS.IS_OUTLET]: user_type === 0 || user_type === 2,  // Outlet for type 0 & 2
            [MENU_AUTH.COLUMNS.IS_WAREHOUSE]: user_type === 1 || user_type === 2, // Warehouse for type 1 & 2
            [MENU_AUTH.COLUMNS.VIEW]: item.view,
            [MENU_AUTH.COLUMNS.SAVE]: item.save,
            [MENU_AUTH.COLUMNS.EDIT]: item.edit,
            [MENU_AUTH.COLUMNS.DELETE]: item.delete,
            [MENU_AUTH.COLUMNS.USER_ID]: user_id,
            [SUBMENU.COLUMNS.CREATED_BY]: created_by,
            [SUBMENU.COLUMNS.UPDATED_BY]: created_by,
          });
        }
      });
    });

    const insertData = [...uniqueMenuAuthDetails.values()];

    if (!insertData.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "No valid menu authorization data to insert",
        property: "",
        code: "NOT_FOUND",
      });
    }

    // Perform batch insert with conflict handling
    await knex(MENU_AUTH.NAME)
      .insert(insertData)
      .onConflict([
        MENU_AUTH.COLUMNS.USER_ID,
        MENU_AUTH.COLUMNS.MENU_ID,
        MENU_AUTH.COLUMNS.SUBMENU_ID,
        MENU_AUTH.COLUMNS.COMPANY_ID,
        MENU_AUTH.COLUMNS.ROLE_ID // Ensure conflict resolution is role-based
      ])
      .merge({
        [MENU_AUTH.COLUMNS.VIEW]: knex.raw('EXCLUDED.view'),
        [MENU_AUTH.COLUMNS.SAVE]: knex.raw('EXCLUDED.save'),
        [MENU_AUTH.COLUMNS.EDIT]: knex.raw('EXCLUDED.edit'),
        [MENU_AUTH.COLUMNS.DELETE]: knex.raw('EXCLUDED.delete'),
        [MENU_AUTH.COLUMNS.UPDATED_BY]: knex.raw('EXCLUDED.updated_by')
      });

    return { success: true };
  }

  async function menuAuthList({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { warehouse_type, company_id, user_id } = params;

    const query = knex
      .select([
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.MENU_ID}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ICON}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_URL}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.SUBMENU_ID}`,
        knex.raw("COALESCE(??, ?) AS ??", [`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.VIEW}`, false, "view"]),
        knex.raw("COALESCE(??, ?) AS ??", [`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.SAVE}`, false, "save"]),
        knex.raw("COALESCE(??, ?) AS ??", [`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.EDIT}`, false, "edit"]),
        knex.raw("COALESCE(??, ?) AS ??", [`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.DELETE}`, false, "delete"]),
        knex.raw("MIN(??) AS ??", [`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_NAME}`, "sub_menu_name"]),
        knex.raw("MIN(??) AS ??", [`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_URL}`, "sub_menu_url"]),
        knex.raw("MIN(??) AS ??", [`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_ORDER}`, "sub_menu_order"])
      ])
      .from(`${MENU_AUTH.NAME} as ${MENU_AUTH.NAME}`)
      .leftJoin(
        `${MENU.NAME} as ${MENU.NAME}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.MENU_ID}`,
        `${MENU.NAME}.${MENU.COLUMNS.ID}`
      )
      .leftJoin(
        `${SUBMENU.NAME} as ${SUBMENU.NAME}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.SUBMENU_ID}`,
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.ID}`
      )
      .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.COMPANY_ID}`, 1)
      .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.IS_ACTIVE}`, true)
      .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.USER_ID}`, user_id)
      .groupBy([
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.MENU_ID}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ICON}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_URL}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.SUBMENU_ID}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.VIEW}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.SAVE}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.EDIT}`,
        `${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.DELETE}`
      ])
      .orderBy(`${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`, "ASC")
      .orderBy(knex.raw("MIN(??)", [`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_ORDER}`]), "ASC");
    // Warehouse Type Condition
    if (warehouse_type !== undefined) {
      switch (Number(warehouse_type)) {
        case 0:
          query.where(`${MENU.NAME}.${MENU.COLUMNS.IS_OUTLET}`, true);
          break;
        case 1:
          query.where(`${MENU.NAME}.${MENU.COLUMNS.IS_WAREHOUSE}`, true);
          break;
        case 2:
          query.where((builder) =>
            builder
              .where(`${MENU.NAME}.${MENU.COLUMNS.IS_OUTLET}`, true)
              .orWhere(`${MENU.NAME}.${MENU.COLUMNS.IS_WAREHOUSE}`, true)
          );
          break;
      }
    }

    let response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Menu",
      logTrace
    });

    let name = "Dashboard";

    // ✅ Check if user has menu permissions
    const default_menu = await knex(MENU.NAME)
      .select(
        `${MENU.NAME}.${MENU.COLUMNS.ID} as menu_id`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ICON}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_URL}`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`
      )
      .whereRaw(`LOWER(${MENU.NAME}.${MENU.COLUMNS.MENU_NAME}) = LOWER(?)`, [name])
      .where(`${MENU.NAME}.${MENU.COLUMNS.IS_ACTIVE}`, true);

    // ✅ If no menu found, throw an error
    if (!default_menu || !default_menu.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Menu authentication not found",
        property: "",
        code: "NOT_FOUND",
      });
    }

    // ✅ Add default_menu[0] only once at the beginning with permissions
    const finalResponse = [
      { ...default_menu[0] },
      ...response
    ];

    // ✅ Ensure all submenu entries have default values
    const updatedResponse = finalResponse.map((item) => ({
      ...item,
      view: item.view ?? false,
      save: item.save ?? false,
      edit: item.edit ?? false,
      delete: item.delete ?? false,
    }));

    return updatedResponse;

  }

  async function getRolePermissionPaginationRepo({ params, body, queryString, logTrace, userDetails }) {
    const knex = this;
    const { page_size, current_page } = params;
    const { search } = queryString;
    const roleSubquery = knex(`${ROLE_MAPPING.NAME}`)
      .select([
        `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`,
        knex.raw(`jsonb_agg(distinct to_jsonb(${ROLES.NAME})) as roles`),
        knex.raw(`bool_or(${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.IS_ACTIVE}) AS is_active`) // Aggregate is_active
      ])
      .leftJoin(
        `${ROLES.NAME}`,
        `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.ROLE_ID}`,
        `${ROLES.NAME}.${ROLES.COLUMNS.ID}`
      )
      // .where(`${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
      .groupBy(`${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`);

    const query1 = knex
      .select([
        `${USERS.NAME}.${USERS.COLUMNS.ID}`,
        knex.raw(`to_jsonb(${USERS.NAME}.*) as user_id`),
        knex.raw(`COALESCE(roles.roles, '[]'::jsonb) AS role_id`), // Use aggregated role_id
        knex.raw(`COALESCE(roles.is_active, false) AS is_active`), // Use aggregated is_active
        `${USERS.NAME}.${USERS.COLUMNS.LOGIN_UPDATED_AT}`,
        `${USERS.NAME}.${USERS.COLUMNS.PASSWORD_UPDATED_AT}`,
        `${USERS.NAME}.${USERS.COLUMNS.USER_TYPE}`
      ])
      .from(`${USERS.NAME}`)
      .leftJoin(roleSubquery.as("roles"), `${USERS.NAME}.${USERS.COLUMNS.ID}`, "roles.user_id")
      .groupBy(`${USERS.NAME}.${USERS.COLUMNS.ID}`, "roles.roles", "roles.is_active")
      // .where(`${USERS.NAME}.${USERS.COLUMNS.COMPANY_ID}`, company_id)
      .orderBy(`${USERS.NAME}.${USERS.COLUMNS.ID}`, "ASC");

    if (search && search.length >= 3) {
      query1.where(function () {
        this.where(`${USERS.NAME}.${USERS.COLUMNS.USER_NAME}`, "ilike", `%${search}%`)
          .orWhereRaw(`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(roles.roles) AS role_name
              WHERE role_name ILIKE ?
            )`, [`%${search}%`]);
      });
    }


    const response = await query1.paginate({
      pageSize: page_size, // Customize as needed
      currentPage: current_page // Customize as needed
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
        message: "User not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const userTypeMapping = {
      0: "Outlet",
      1: "Warehouse",
      2: "Both"
    };

    const finalResponse = response.data.map((item) => {
      const currentDate = new Date(); // Get the current date
      const passwordUpdatedAt = new Date(item.password_updated_at);
      const loginUpdatedAt = new Date(item.login_updated_at);

      // Function to calculate days difference
      const getDaysDifference = (updatedDate, type) => {
        const diffTime = Math.abs(currentDate - updatedDate); // Time difference in milliseconds
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

        if (diffDays === 0) {
          return type === "password" ? "User password changed today" : "User logged in today";
        } else {
          return type === "password"
            ? `Password last changed ${diffDays} days ago`
            : `User last logged in ${diffDays} days ago`;
        }
      };

      return {
        ...item,
        Password: getDaysDifference(passwordUpdatedAt, "password"),
        Activity: getDaysDifference(loginUpdatedAt, "login"),
        Access: userTypeMapping[item.user_type] || null,
      };
    });

    return { data: finalResponse, meta: response.meta };
  }

  async function getRolePermissionRepo({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { user_id } = params;
    // ✅ Get user details
    const userResponse = await knex(USERS.NAME)
      .where(`${USERS.NAME}.${USERS.COLUMNS.ID}`, user_id)
      // .where(`${USERS.NAME}.${USERS.COLUMNS.COMPANY_ID}`, company_id)
      .first();

    if (!userResponse) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "User not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    const { user_type } = userResponse;

    // ✅ Check if user has menu permissions
    const validUser = await knex(MENU_AUTH.NAME)
      .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.USER_ID}`, user_id)
      // .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.COMPANY_ID}`, company_id)
      .where(`${MENU_AUTH.NAME}.${MENU_AUTH.COLUMNS.IS_ACTIVE}`, true)

    let query = knex
      .select([
        `${MENU.NAME}.${MENU.COLUMNS.ID} as menu_id`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_NAME} as menu_name`,
        `${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER} as menu_order`,
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.ID} as submenu_id`,
        `${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_NAME} as sub_menu_name`,
      ])
      .from(`${MENU.NAME}`)
      .leftJoin(`${SUBMENU.NAME}`, function () {
        this.on(`${MENU.NAME}.${MENU.COLUMNS.ID}`, "=", `${SUBMENU.NAME}.${SUBMENU.COLUMNS.MENU_ID}`)
          .on(`${SUBMENU.NAME}.${SUBMENU.COLUMNS.IS_ACTIVE}`, "=", knex.raw("?", [true]));
      })
      .where(`${MENU.NAME}.${MENU.COLUMNS.IS_ACTIVE}`, true)
      // .where(`${MENU.NAME}.${MENU.COLUMNS.COMPANY_ID}`, company_id)
      .orderBy(`${MENU.NAME}.${MENU.COLUMNS.MENU_ORDER}`, "ASC")
      .orderBy(knex.raw("COALESCE(??, NULL)", [`${SUBMENU.NAME}.${SUBMENU.COLUMNS.SUBMENU_ORDER}`]), "ASC");
    // ✅ Warehouse Type Condition
    if (Number(user_type) === 0) {
      query.where(`${MENU.NAME}.${MENU.COLUMNS.IS_OUTLET}`, true);
    } else if (Number(user_type) === 1) {
      query.where(`${MENU.NAME}.${MENU.COLUMNS.IS_WAREHOUSE}`, true);
    } else if (Number(user_type) === 2) {
      query.where((builder) =>
        builder
          .where(`${MENU.NAME}.${MENU.COLUMNS.IS_OUTLET}`, true)
          .orWhere(`${MENU.NAME}.${MENU.COLUMNS.IS_WAREHOUSE}`, true)
      );
    }

    let response = await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Menu",
      logTrace
    });

    const transformedData = response.map((menu) => {
      // Find matching permission in validUser array
      const matchingPermission = validUser.find((perm) => {
        return (
          Number(perm.menu_id) === Number(menu.menu_id) &&
          (perm.submenu_id === null || Number(perm.submenu_id) === Number(menu.submenu_id))
        );
      });

      return {
        ...menu,
        permission: matchingPermission
          ? {
            view: matchingPermission.view,
            save: matchingPermission.save,
            edit: matchingPermission.edit,
            delete: matchingPermission.delete,
          }
          : {
            view: false,
            save: false,
            edit: false,
            delete: false,
          },
      };
    });

    return transformedData;

  }

  async function putRolePermissionRepo({ params, body, logTrace, userDetails }) {
    const knex = this;
    const { user_id } = params;
    const { is_active } = body;
    // ✅ Get user details
    const userResponse = await knex(ROLE_MAPPING.NAME)
      .where(`${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`, user_id)

    if (!userResponse) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Role permission not found",
        property: "",
        code: "NOT_FOUND"
      });
    }


    let query = knex(`${ROLE_MAPPING.NAME}`)
      .where(`${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`, user_id)
      .update({
        [ROLE_MAPPING.COLUMNS.IS_ACTIVE]: is_active,
      })


    await query;

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Menu",
      logTrace
    });

    return { success: true }

  }

  return {
    postMenuAuth,
    menuAuthList,
    getRolePermissionPaginationRepo,
    getRolePermissionRepo,
    putRolePermissionRepo
  };
}

module.exports = menuAuthRepo;
