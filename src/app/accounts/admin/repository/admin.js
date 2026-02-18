const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { USERS, USERS_LOGS, MENU_AUTH, LOGIN_IPLOGS, COMPANY_USER_MAPPING, COMPANY } = require("../commons/constants");
const { ROLES } = require("../commons/constants");
const { ROLE_MAPPING } = require("../commons/constants");
const { OUTLET_MAPPING, WAREHOUSE_MAPPING } = require("../commons/constants");
const { OUTLETS } = require("../../outlets/commons/constants");
const { WAREHOUSE, OUTLET_PRODUCT_MAPPING, ITEM } = require("../../../catalog/commons");
const { COMPANY_BANK_DETAILS } = require("../../company/commons/constants");
const { STATES, CITIES, COUNTRIES } = require("../../../masterData/commons/constants");


function adminRepo(fastify) {
  async function getAdminUser({ body, query, params, logTrace }) {
    const knex = this;
    const { search } = query;
    const { company_id, page_size, current_page } = params;
    const query1 = knex
      .select([
        `${USERS.NAME}.*`
      ])
      .from(`${USERS.NAME} as ${USERS.NAME}`)
      .orderBy(`${USERS.NAME}.${USERS.COLUMNS.ID}`, 'desc')

    if (search && search.length >= 3) {
      query1
        .where(USERS.COLUMNS.USER_NAME, "ilike", `%${search}%`)
        .orWhere(USERS.COLUMNS.USER_EMAIL, "ilike", `%${search}%`)
        .orWhere(USERS.COLUMNS.USER_MOBILE, "ilike", `%${search}%`);
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
        message: "Users not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    console.log(response, "response")
    const usersWithRoleAndOutlets = await Promise.all(
      response.data.map(async user => {
        const outlet_roles = await knex
          .select([`${ROLES.NAME}.*`])
          .from(`${ROLE_MAPPING.NAME} as ${ROLE_MAPPING.NAME}`)
          .leftJoin(
            `${ROLES.NAME} as ${ROLES.NAME}`,
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.ROLE_ID}`,
            `${ROLES.NAME}.${ROLES.COLUMNS.ID}`
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`,
            user.id
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.COMPANY_ID}`,
            params.company_id
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.IS_OUTLET}`,
            true
          );

        // Fetch Outlets
        const outlets = await knex
          .select([
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.SHORTNAME}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.FULLNAME}`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OPENING_STOCK} as opening_stock`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.BALENCE_STOCK} as balance_stock`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.MIN_STOCK} as min_stock`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.ALLOW_NEG_STK} as allow_neg_stk`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.WSCALE} as wscale`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_PURCHASE} as outlet_purchase`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_NON_SALEABLE} as outlet_non_saleable`
          ])
          .from(`${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`)
          .innerJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .leftJoin(
            `${OUTLET_PRODUCT_MAPPING.NAME} as ${OUTLET_PRODUCT_MAPPING}`,
            `${OUTLET_PRODUCT_MAPPING}.${OUTLET_PRODUCT_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`, user.id)
          .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, params.company_id)
          .orderBy(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`, 'asc')
          .distinctOn(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`); // Use DISTINCT ON to avoid duplicates


        const warehouse = await knex
          .select([`${WAREHOUSE.NAME}.*`])
          .from(`${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`,
            user.id
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .where(
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`,
            true
          )

        const warehouse_roles = await knex
          .select([`${ROLES.NAME}.*`])
          .from(`${ROLE_MAPPING.NAME} as ${ROLE_MAPPING.NAME}`)
          .leftJoin(
            `${ROLES.NAME} as ${ROLES.NAME}`,
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.ROLE_ID}`,
            `${ROLES.NAME}.${ROLES.COLUMNS.ID}`
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`,
            user.id
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.IS_WAREHOUSE}`,
            true
          );

        const companyDetails = await knex
          .select([
            `${COMPANY.NAME}.*`,
            `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
            `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
          ])
          .from(`${COMPANY_USER_MAPPING.NAME} as ${COMPANY_USER_MAPPING.NAME}`)
          .leftJoin(
            `${COMPANY.NAME} as ${COMPANY.NAME}`,
            `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
          )
          .leftJoin(
            `${STATES.NAME} as ${STATES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.STATE}`,
            `${STATES.NAME}.${STATES.COLUMNS.ID}`
          )
          .leftJoin(
            `${CITIES.NAME} as ${CITIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.CITY}`,
            `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
          )
          .leftJoin(
            `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.COUNTRY}`,
            `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
          )
          .where(
            `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.USER_ID}`,
            user.id
          )
          .where(
            `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )

        const company_details = await Promise.all(
          companyDetails.map(async company => {
            const bank_details = await knex(COMPANY_BANK_DETAILS.NAME).where(
              COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID,
              company.id
            );

            return { ...company, bank_details };
          })
        );

        return { ...user, outlets, outlet_roles, warehouse, warehouse_roles, company_details };
      })
    );
    const combinedResponse = {
      data: usersWithRoleAndOutlets,
      meta: response.meta
    };

    return combinedResponse;
  }

  async function postAdminUser({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;

    // Check if the user already exists
    const exists_response = await knex(USERS.NAME)
      .where(USERS.COLUMNS.USER_EMAIL, String(body.user_email).trim())
      .orWhere(USERS.COLUMNS.USER_MOBILE, String(body.user_mobile).trim())
      .orWhere(USERS.COLUMNS.USER_NAME, String(body.user_name).trim());

    if (exists_response.length > 0) {
      let conflictField = "";

      if (exists_response.some(user => user.user_email === body.user_email.trim())) {
        conflictField = "Email already exists";
      } else if (exists_response.some(user => user.user_mobile === body.user_mobile.trim())) {
        conflictField = "Mobile number already exists";
      } else if (exists_response.some(user => user.user_name === body.user_name.trim())) {
        conflictField = "Username already exists";
      }

      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: conflictField,
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }


    // Hash the user password with SHA-256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.user_password)
      .digest("hex");

    // Insert user into the USERS table
    const response = await knex(USERS.NAME)
      .returning("id")
      .insert({
        [USERS.COLUMNS.USER_NAME]: String(body.user_name).trim(),
        [USERS.COLUMNS.USER_EMAIL]: String(body.user_email).trim(),
        [USERS.COLUMNS.USER_MOBILE]: String(body.user_mobile).trim(),
        [USERS.COLUMNS.USER_PASSWORD]: hashedPassword,
        [USERS.COLUMNS.COMPANY_ID]: body.company_id,
        [USERS.COLUMNS.USER_TYPE]: body.user_type,
        [USERS.COLUMNS.PASSWORD_UPDATED_AT]: knex.fn.now(),
        [USERS.COLUMNS.CREATED_BY]: created_by
      });

    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating Admin Users",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const user_id = response[0].id;

    const {
      user_type,
      company_details = [],
      outlets_roles = [],
      outlets = [],
      warehouse_roles = [],
      warehouse = []
    } = body;

    // Validate company_details presence
    if (!company_details.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "company_details must be provided",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    for (const { company_id } of company_details) {
      const commonRoleBase = {
        [ROLE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [ROLE_MAPPING.COLUMNS.USER_ID]: user_id,
        [ROLE_MAPPING.COLUMNS.CREATED_BY]: created_by,
        [ROLE_MAPPING.COLUMNS.UPDATED_BY]: created_by
      };

      const commonMapBase = {
        [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id,
        [OUTLET_MAPPING.COLUMNS.CREATED_BY]: created_by,
        [OUTLET_MAPPING.COLUMNS.UPDATED_BY]: created_by
      };

      if (user_type === 0 || user_type === 2) {
        if (outlets_roles.length > 0) {
          const outletRolesData = outlets_roles.map(role => ({
            ...commonRoleBase,
            [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
            [ROLE_MAPPING.COLUMNS.IS_OUTLET]: true,
            [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: Number(user_type === 2) ? true : false,
          }));

          const inserted = await knex(ROLE_MAPPING.NAME).insert(outletRolesData);
          if (!inserted) throw CustomError.create({
            httpCode: StatusCodes.NOT_IMPLEMENTED,
            message: `Error while creating Outlet Role Mapping for company_id ${company_id}`,
            property: "",
            code: "NOT_IMPLEMENTED"
          });
        }

        if (outlets.length > 0) {
          const outletData = outlets.map(outlet => ({
            ...commonMapBase,
            [OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id
          }));

          const inserted = await knex(OUTLET_MAPPING.NAME).insert(outletData);
          if (!inserted) throw CustomError.create({
            httpCode: StatusCodes.NOT_IMPLEMENTED,
            message: `Error while creating Outlet Mapping for company_id ${company_id}`,
            property: "",
            code: "NOT_IMPLEMENTED"
          });
        }
      }

      if (user_type === 1 || user_type === 2) {
        if (warehouse_roles.length > 0) {
          const warehouseRolesData = warehouse_roles.map(role => ({
            ...commonRoleBase,
            [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
            [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: true,
            [ROLE_MAPPING.COLUMNS.IS_OUTLET]: Number(user_type === 2) ? true : false
          }));

          const inserted = await knex(ROLE_MAPPING.NAME).insert(warehouseRolesData);
          if (!inserted) throw CustomError.create({
            httpCode: StatusCodes.NOT_IMPLEMENTED,
            message: `Error while creating Warehouse Role Mapping for company_id ${company_id}`,
            property: "",
            code: "NOT_IMPLEMENTED"
          });
        }

        if (warehouse.length > 0) {
          const warehouseData = warehouse.map(ware => ({
            [WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: ware.warehouse_id,
            [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
            [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id,
            [WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: created_by,
            [WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: created_by
          }));

          const inserted = await knex(WAREHOUSE_MAPPING.NAME).insert(warehouseData);
          if (!inserted) throw CustomError.create({
            httpCode: StatusCodes.NOT_IMPLEMENTED,
            message: `Error while creating Warehouse Mapping for company_id ${company_id}`,
            property: "",
            code: "NOT_IMPLEMENTED"
          });
        }
      }
      // Company-user mapping (only for warehouse users and both)
      const companyUserMap = {
        [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id,
        [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
        [COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE]: true,
        [COMPANY_USER_MAPPING.COLUMNS.CREATED_BY]: created_by,
        [COMPANY_USER_MAPPING.COLUMNS.UPDATED_BY]: created_by
      };

      const inserted = await knex(COMPANY_USER_MAPPING.NAME).insert(companyUserMap);
      if (!inserted) throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: `Error while creating Company User Mapping for company_id ${company_id}`,
        property: "",
        code: "NOT_IMPLEMENTED"
      });


      // Handle invalid user_type
      if (![0, 1, 2].includes(user_type)) {
        throw CustomError.create({
          httpCode: StatusCodes.BAD_REQUEST,
          message: "Invalid user type",
          property: "",
          code: "BAD_REQUEST"
        });
      }
    }

    // Insert log entry
    await knex(USERS_LOGS.NAME).insert({
      [USERS_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [USERS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [USERS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [USERS_LOGS.COLUMNS.CREATE_USER_ID]: user_id,
      [USERS_LOGS.COLUMNS.CREATE_USER_NAME]: String(body.user_name).trim()
    });

    return { success: true };
  }

  async function putAdminUser({ user_id, company_id, body, logTrace, userDetails }) {
    const knex = this;
    const updated_by = userDetails.id;
    console.log(body.is_active, "isactivw")
    const updatedUser = await knex(USERS.NAME)
      .where("id", user_id)
      .update({
        [USERS.COLUMNS.USER_NAME]: body.user_name,
        [USERS.COLUMNS.USER_EMAIL]: body.user_email,
        [USERS.COLUMNS.USER_MOBILE]: body.user_mobile,
        [USERS.COLUMNS.COMPANY_ID]: body.company_id,
        [USERS.COLUMNS.USER_TYPE]: body.user_type,
        [USERS.COLUMNS.IS_ACTIVE]: body.is_active ?? true,
        [USERS.COLUMNS.UPDATED_BY]: updated_by,
        [USERS.COLUMNS.UPDATED_AT]: knex.fn.now(),
      });

    if (!updatedUser) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "User not found",
        property: "",
        code: "NOT_FOUND",
      });
    }

    // Step 2: Update password only if provided
    if (body.user_password) {
      const hashedPassword = crypto.createHash("sha256")
        .update(body.user_password)
        .digest("hex");

      await knex(USERS.NAME)
        .where("id", user_id)
        .update({
          [USERS.COLUMNS.USER_PASSWORD]: hashedPassword,
          [USERS.COLUMNS.PASSWORD_UPDATED_AT]: knex.fn.now()
        });
    }
    const {
      user_type,
      company_details = [],
      outlets_roles = [],
      outlets = [],
      warehouse_roles = [],
      warehouse = []
    } = body;

    if (!company_details.length) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "company_details must be provided",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    if (![0, 1, 2].includes(user_type)) {
      throw CustomError.create({
        httpCode: StatusCodes.BAD_REQUEST,
        message: "Invalid user type",
        property: "",
        code: "BAD_REQUEST"
      });
    }

    for (const { company_id } of company_details) {
      await knex.transaction(async trx => {
        const baseRoleData = {
          [ROLE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
          [ROLE_MAPPING.COLUMNS.USER_ID]: user_id,
          [ROLE_MAPPING.COLUMNS.CREATED_BY]: user_id,
          [ROLE_MAPPING.COLUMNS.UPDATED_BY]: user_id
        };

        // OUTLET-ONLY logic
        if (user_type === 0) {
          // Clean existing outlet-related mappings
          await trx(ROLE_MAPPING.NAME)
            .where({
              [ROLE_MAPPING.COLUMNS.USER_ID]: user_id,
              [ROLE_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(OUTLET_MAPPING.NAME)
            .where({
              [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id
            })
            .delete();

          await trx(WAREHOUSE_MAPPING.NAME)
            .where({
              [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id
            })
            .delete();

          await trx(COMPANY_USER_MAPPING.NAME)
            .where({
              [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
              [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          // await trx(MENU_AUTH.NAME)
          //   .where({
          //     [MENU_AUTH.COLUMNS.USER_ID]: user_id,
          //     [MENU_AUTH.COLUMNS.COMPANY_ID]: company_id
          //   })
          //   .delete();

          // Insert outlet roles
          const roleRows = outlets_roles.map(role => ({
            ...baseRoleData,
            [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
            [ROLE_MAPPING.COLUMNS.IS_OUTLET]: true,
            [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: false
          }));
          if (roleRows.length) await trx(ROLE_MAPPING.NAME).insert(roleRows);

          // Insert outlet mapping
          if (outlets.length) {
            const outletMappings = outlets.map(outlet => ({
              [OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
              [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id,
              [OUTLET_MAPPING.COLUMNS.CREATED_BY]: user_id,
              [OUTLET_MAPPING.COLUMNS.UPDATED_BY]: user_id
            }));
            await trx(OUTLET_MAPPING.NAME).insert(outletMappings);
          }

          // Insert company-user mapping
          await trx(COMPANY_USER_MAPPING.NAME).insert({
            [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id,
            [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE]: true,
            [COMPANY_USER_MAPPING.COLUMNS.CREATED_BY]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.UPDATED_BY]: user_id
          });
        }

        // WAREHOUSE-ONLY logic
        if (user_type === 1) {
          // Clean existing warehouse-related mappings
          await trx(ROLE_MAPPING.NAME)
            .where({
              [ROLE_MAPPING.COLUMNS.USER_ID]: user_id,
              [ROLE_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(WAREHOUSE_MAPPING.NAME)
            .where({
              [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(OUTLET_MAPPING.NAME)
            .where({
              [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id,
              [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(COMPANY_USER_MAPPING.NAME)
            .where({
              [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
              [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          // await trx(MENU_AUTH.NAME)
          //   .where({
          //     [MENU_AUTH.COLUMNS.USER_ID]: user_id,
          //     [MENU_AUTH.COLUMNS.COMPANY_ID]: company_id
          //   })
          //   .delete();

          // Insert warehouse roles
          const roleRows = warehouse_roles.map(role => ({
            ...baseRoleData,
            [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
            [ROLE_MAPPING.COLUMNS.IS_OUTLET]: false,
            [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: true
          }));
          if (roleRows.length) await trx(ROLE_MAPPING.NAME).insert(roleRows);

          // Insert warehouse mapping
          if (warehouse.length) {
            const warehouseMappings = warehouse.map(ware => ({
              [WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: ware.warehouse_id,
              [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: user_id
            }));
            await trx(WAREHOUSE_MAPPING.NAME).insert(warehouseMappings);
          }

          // Insert company-user mapping
          await trx(COMPANY_USER_MAPPING.NAME).insert({
            [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id,
            [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE]: true,
            [COMPANY_USER_MAPPING.COLUMNS.CREATED_BY]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.UPDATED_BY]: user_id
          });
        }

        // BOTH OUTLET + WAREHOUSE
        if (user_type === 2) {
          // Clean both outlet and warehouse mappings
          await trx(ROLE_MAPPING.NAME)
            .where({
              [ROLE_MAPPING.COLUMNS.USER_ID]: user_id,
              [ROLE_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(OUTLET_MAPPING.NAME)
            .where({
              [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id
            })
            .delete();

          await trx(WAREHOUSE_MAPPING.NAME)
            .where({
              [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          await trx(COMPANY_USER_MAPPING.NAME)
            .where({
              [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
              [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id
            })
            .delete();

          // await trx(MENU_AUTH.NAME)
          //   .where({
          //     [MENU_AUTH.COLUMNS.USER_ID]: user_id,
          //     [MENU_AUTH.COLUMNS.COMPANY_ID]: company_id
          //   })
          //   .delete();

          // Insert both outlet and warehouse roles
          const combinedRoles = [
            ...outlets_roles.map(role => ({
              ...baseRoleData,
              [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
              [ROLE_MAPPING.COLUMNS.IS_OUTLET]: true,
              [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: true
            })),
            ...warehouse_roles.map(role => ({
              ...baseRoleData,
              [ROLE_MAPPING.COLUMNS.ROLE_ID]: role.role_id,
              [ROLE_MAPPING.COLUMNS.IS_OUTLET]: true,
              [ROLE_MAPPING.COLUMNS.IS_WAREHOUSE]: true
            }))
          ];
          if (combinedRoles.length) await trx(ROLE_MAPPING.NAME).insert(combinedRoles);

          // Insert outlet mappings
          if (outlets.length) {
            const outletMappings = outlets.map(outlet => ({
              [OUTLET_MAPPING.COLUMNS.OUTLET_ID]: outlet.outlet_id,
              [OUTLET_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [OUTLET_MAPPING.COLUMNS.USER_ID]: user_id,
              [OUTLET_MAPPING.COLUMNS.CREATED_BY]: user_id,
              [OUTLET_MAPPING.COLUMNS.UPDATED_BY]: user_id
            }));
            await trx(OUTLET_MAPPING.NAME).insert(outletMappings);
          }

          // Insert warehouse mappings
          if (warehouse.length) {
            const warehouseMappings = warehouse.map(ware => ({
              [WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID]: ware.warehouse_id,
              [WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID]: company_id,
              [WAREHOUSE_MAPPING.COLUMNS.USER_ID]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.CREATED_BY]: user_id,
              [WAREHOUSE_MAPPING.COLUMNS.UPDATED_BY]: user_id
            }));
            await trx(WAREHOUSE_MAPPING.NAME).insert(warehouseMappings);
          }

          // Insert company-user mapping
          await trx(COMPANY_USER_MAPPING.NAME).insert({
            [COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID]: company_id,
            [COMPANY_USER_MAPPING.COLUMNS.USER_ID]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE]: true,
            [COMPANY_USER_MAPPING.COLUMNS.CREATED_BY]: user_id,
            [COMPANY_USER_MAPPING.COLUMNS.UPDATED_BY]: user_id
          });
        }
      });
    }

    // Update log entry
    await knex(USERS_LOGS.NAME).insert({
      [USERS_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [USERS_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [USERS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [USERS_LOGS.COLUMNS.CREATE_USER_ID]: user_id,
      [USERS_LOGS.COLUMNS.CREATE_USER_NAME]: String(body.user_name).trim()
    });

    return { success: true };
  }

  async function deleteAdminUser({ user_id, company_id, logTrace, params, userDetails }) {
    const knex = this;

    // Check if user exists
    const exists_response = await knex(USERS.NAME)
      .where(USERS.COLUMNS.ID, user_id)
      .andWhere(USERS.COLUMNS.COMPANY_ID, company_id);

    if (exists_response.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "User not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    return knex.transaction(async (trx) => {
      // Delete user
      const response = await trx(USERS.NAME)
        .where(USERS.COLUMNS.ID, user_id)
        .del();

      if (!response) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "User not found",
          property: "",
          code: "NOT_FOUND"
        });
      }

      // Delete mappings in parallel
      await Promise.all([
        trx(ROLE_MAPPING.NAME)
          .where(ROLE_MAPPING.COLUMNS.USER_ID, user_id)
          .where(ROLE_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
          .del(),

        trx(OUTLET_MAPPING.NAME)
          .where(OUTLET_MAPPING.COLUMNS.USER_ID, user_id)
          .where(OUTLET_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
          .del(),

        trx(WAREHOUSE_MAPPING.NAME)
          .where(WAREHOUSE_MAPPING.COLUMNS.USER_ID, user_id)
          .where(WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
          .del(),

        trx(COMPANY_USER_MAPPING.NAME)
          .where(COMPANY_USER_MAPPING.COLUMNS.USER_ID, user_id)
          .where(COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID, params.company_id)
          .del()
      ]);

      // Delete log entry
      await knex(USERS_LOGS.NAME).insert({
        [USERS_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
        [USERS_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [USERS_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [USERS_LOGS.COLUMNS.CREATE_USER_ID]: user_id,
        [USERS_LOGS.COLUMNS.CREATE_USER_NAME]: String(exists_response[0]?.user_name).trim()
      });

      return { success: true };
    });
  }

  async function adminLogin({ body, params, logTrace }) {
    const knex = this;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");

    const query = knex(USERS.NAME)
      .where(USERS.COLUMNS.IS_ACTIVE, true)
      .andWhere((builder) => {
        builder.orWhere(USERS.COLUMNS.USER_EMAIL, body.email)
          .orWhere(USERS.COLUMNS.USER_NAME, body.email);
      })
      .andWhere(USERS.COLUMNS.USER_PASSWORD, hashedPassword)

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Admin Users",
      logTrace
    });
    const response = await query;
    console.log("response", response);
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Invalid Credentials",
        property: "",
        code: "NOT_FOUND"
      });
    }

    let company_id = response[0].company_id;
    let userId = response[0].id;

    if (Number(response[0].user_type) === 0) {
      const outlets = await knex
        .select([`${OUTLETS.NAME}.*`])
        .from(`${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`)
        .leftJoin(
          `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
          `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
        )
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`, userId)
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

      return { user: response[0], outlets };
    } else if (Number(response[0].user_type) === 1) {
      const warehouse = await knex
        .select([
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`
        ])
        .from(`${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`)
        .leftJoin(
          `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
          `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
        )
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`, userId)
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`, true);

      return { user: response[0], warehouse }; // ✅ added return
    } else {
      const outlets = await knex
        .select([`${OUTLETS.NAME}.*`])
        .from(`${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`)
        .leftJoin(
          `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
          `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
          `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
        )
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`, userId)
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
        .where(`${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`, true);

      const warehouse = await knex
        .select([
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`
        ])
        .from(`${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`)
        .leftJoin(
          `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
          `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
          `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
        )
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`, userId)
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID}`, company_id)
        .where(`${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`, true)
        .where(`${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`, true);

      return { user: response[0], outlets, warehouse }; // ✅ added return
    }

  }

  async function getAdminUserInfo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const { company_id } = params;
    const user_id = userDetails?.id;

    const query = knex
      .distinct(`${USERS.NAME}.${USERS.COLUMNS.ID}`)
      .select([
        `${USERS.NAME}.*`
      ])
      .from(`${USERS.NAME} as ${USERS.NAME}`)
      .leftJoin(
        `${COMPANY_USER_MAPPING.NAME} as ${COMPANY_USER_MAPPING.NAME}`,
        `${USERS.NAME}.${USERS.COLUMNS.ID}`,
        `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.USER_ID}`
      )
      .where(`${USERS.NAME}.${USERS.COLUMNS.ID}`, user_id)
      .where(`${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE}`, true)
      .where(`${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.COMPANY_ID}`, company_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Users",
      logTrace
    });
    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "User is not registered in the specified company",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const userId = response[0].id;
    console.log(userId, "db user id")
    const usersWithRoleAndOutlets = await Promise.all(
      response.map(async user => {
        const roles = await knex
          .select([`${ROLES.NAME}.*`])
          .from(`${ROLE_MAPPING.NAME} as ${ROLE_MAPPING.NAME}`)
          .leftJoin(
            `${ROLES.NAME} as ${ROLES.NAME}`,
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.ROLE_ID}`,
            `${ROLES.NAME}.${ROLES.COLUMNS.ID}`
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .where(
            `${ROLES.NAME}.${ROLES.COLUMNS.IS_ACTIVE}`,
            true
          )
        const outlets = await knex
          .select([`${OUTLETS.NAME}.*`])
          .from(`${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .where(
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`,
            true
          )

        const warehouse = await knex
          .select([
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`
          ])
          .from(`${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.COMPANY_ID}`,
            company_id
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`,
            true
          )

        return { ...user, roles, outlets, warehouse };
      })
    );

    return usersWithRoleAndOutlets[0];
  }

  async function loginCheck({ body, params, logTrace }) {
    const knex = this;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(body.password)
      .digest("hex");

    const query = knex(USERS.NAME)
      .where(USERS.COLUMNS.IS_ACTIVE, true)
      .andWhere((builder) => {
        builder.orWhere(USERS.COLUMNS.USER_EMAIL, body.email)
          .orWhere(USERS.COLUMNS.USER_NAME, body.email);
      })
      .andWhere(USERS.COLUMNS.USER_PASSWORD, hashedPassword)
      .andWhere(USERS.COLUMNS.IS_LOGGING, true);
    logQuery({
      logger: fastify.log,
      query,
      context: "Check Users Logged in or not",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      return true;
    }

    return false;
  }
  async function loginFlag({ user_id, body, logTrace, userDetails }) {
    const knex = this;

    const query_update = knex(`${USERS.NAME}`)
      .where(`${USERS.COLUMNS.USER_EMAIL}`, body.email)
      .orWhere(`${USERS.COLUMNS.USER_NAME}`, body.email)
      .update({
        [USERS.COLUMNS.IS_LOGGING]: true,
        [USERS.COLUMNS.LOGIN_UPDATED_AT]: knex.fn.now(),
        [USERS.COLUMNS.UPDATED_AT]: new Date()
      });

    logQuery({
      logger: fastify.log,
      query: query_update,
      context: "logging in user login status",
      logTrace
    });

    await query_update;
  }

  async function loginIpLog({ user_id, ip_address, user_agent, logTrace }) {
    const knex = this;
    const query = knex(LOGIN_IPLOGS.NAME).insert({
      [LOGIN_IPLOGS.COLUMNS.USER_ID]: user_id,
      [LOGIN_IPLOGS.COLUMNS.IP_ADDRESS]: ip_address,
      [LOGIN_IPLOGS.COLUMNS.USER_AGENT]: user_agent,
      [LOGIN_IPLOGS.COLUMNS.LOGGED_IN_AT]: new Date()
    });

    logQuery({
      logger: fastify.log,
      query,
      context: "Insert Login IpLog",
      logTrace
    });

    await query;
  }

  async function adminLogout({ body, logTrace, userDetails }) {
    const knex = this;
    const user_id = userDetails.id;
    const query_update = knex(`${USERS.NAME}`)
      .where(`${USERS.COLUMNS.ID}`, user_id)
      .update({
        [USERS.COLUMNS.IS_LOGGING]: false,
        [USERS.COLUMNS.UPDATED_AT]: new Date()
      });

    logQuery({
      logger: fastify.log,
      query: query_update,
      context: "log out the user login status",
      logTrace
    });

    await query_update;

    return { success: true }
  }

  async function getAdminUserList({ body, params, logTrace, userDetails }) {
    const knex = this;
    const query = knex(USERS.NAME)
      .where(USERS.COLUMNS.IS_ACTIVE, true)
      .where(USERS.COLUMNS.COMPANY_ID, params.company_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Users",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Customers not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function userInfo({ body, params, logTrace, userDetails }) {
    const knex = this;
    const user_id = userDetails?.id;
    const query = knex
      .distinct(`${USERS.NAME}.${USERS.COLUMNS.ID}`)
      .select([
        `${USERS.NAME}.*`
      ])
      .from(`${USERS.NAME} as ${USERS.NAME}`)
      .leftJoin(
        `${COMPANY_USER_MAPPING.NAME} as ${COMPANY_USER_MAPPING.NAME}`,
        `${USERS.NAME}.${USERS.COLUMNS.ID}`,
        `${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.USER_ID}`
      )
      .where(`${USERS.NAME}.${USERS.COLUMNS.ID}`, user_id)
      .where(`${COMPANY_USER_MAPPING.NAME}.${COMPANY_USER_MAPPING.COLUMNS.IS_ACTIVE}`, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Users",
      logTrace
    });
    const response = await query;
    console.log(response, "company users")
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "User is not registered in the specified company",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const userId = response[0].id;
    console.log(userId, "db user id")
    const usersWithRoleAndOutlets = await Promise.all(
      response.map(async user => {
        const roles = await knex
          .select([`${ROLES.NAME}.*`])
          .from(`${ROLE_MAPPING.NAME} as ${ROLE_MAPPING.NAME}`)
          .leftJoin(
            `${ROLES.NAME} as ${ROLES.NAME}`,
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.ROLE_ID}`,
            `${ROLES.NAME}.${ROLES.COLUMNS.ID}`
          )
          .where(
            `${ROLE_MAPPING.NAME}.${ROLE_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${ROLES.NAME}.${ROLES.COLUMNS.IS_ACTIVE}`,
            true
          )
        const outlets = await knex
          .select([`${OUTLETS.NAME}.*`])
          .from(`${OUTLET_MAPPING.NAME} as ${OUTLET_MAPPING.NAME}`)
          .leftJoin(
            `${OUTLETS.NAME} as ${OUTLETS.NAME}`,
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.OUTLET_ID}`,
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.ID}`
          )
          .where(
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${OUTLET_MAPPING.NAME}.${OUTLET_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${OUTLETS.NAME}.${OUTLETS.COLUMNS.IS_ACTIVE}`,
            true
          )

        const company = await knex
          .select([`${COMPANY.NAME}.*`])
          .from(`${COMPANY.NAME} as ${COMPANY.NAME}`)
          .leftJoin(
            `${USERS.NAME} as ${USERS.NAME}`,
            `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`,
            `${USERS.NAME}.${USERS.COLUMNS.COMPANY_ID}`
          )
          .where(
            `${USERS.NAME}.${USERS.COLUMNS.ID}`,
            userId
          )
          .andWhere(
            `${COMPANY.NAME}.${COMPANY.COLUMNS.IS_ACTIVE}`,
            true
          );

        const warehouse = await knex
          .select([
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID} as warehouse_id`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.WAREHOUSE_NAME} as warehouse_name`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.SHORT_NAME} as warehouse_short_name`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`
          ])
          .from(`${WAREHOUSE_MAPPING.NAME} as ${WAREHOUSE_MAPPING.NAME}`)
          .leftJoin(
            `${WAREHOUSE.NAME} as ${WAREHOUSE.NAME}`,
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.WAREHOUSE_ID}`,
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.ID}`
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.USER_ID}`,
            userId
          )
          .where(
            `${WAREHOUSE_MAPPING.NAME}.${WAREHOUSE_MAPPING.COLUMNS.IS_ACTIVE}`,
            true
          )
          .where(
            `${WAREHOUSE.NAME}.${WAREHOUSE.COLUMNS.IS_ACTIVE}`,
            true
          )

        return { ...user, roles, outlets, warehouse, company };
      })
    );

    return usersWithRoleAndOutlets[0];
  }



  return {
    getAdminUser,
    postAdminUser,
    putAdminUser,
    deleteAdminUser,
    adminLogin,
    getAdminUserInfo,
    loginCheck,
    loginFlag,
    adminLogout,
    getAdminUserList,
    loginIpLog,
    userInfo
  };
}

module.exports = adminRepo;
