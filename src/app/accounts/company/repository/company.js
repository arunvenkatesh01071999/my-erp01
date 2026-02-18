const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { COMPANY_LOGS } = require("../commons/constants");
const { COMPANY } = require("../commons/constants");
const { COMPANY_BANK_DETAILS } = require("../commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");


function companyRepo(fastify) {
  async function postCompany({ params, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;
    // Check if deleting this company would leave the database empty
    const companyCount = await knex(COMPANY.NAME).count("* as count").first();

    if (isNaN(companyCount) || companyCount <= 1) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Minimum One Company For The Warehouse",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    const query_insert = await knex(`${COMPANY.NAME}`)
      .returning("id")
      .insert({
        [COMPANY.COLUMNS.CODE]: String(body.code).trim(),
        [COMPANY.COLUMNS.SHORTNAME]: String(body.company_short_name).trim(),
        [COMPANY.COLUMNS.FULLNAME]: String(body.company_fullname).trim(),
        [COMPANY.COLUMNS.ADD1]: String(body.add1).trim(),
        [COMPANY.COLUMNS.ADD2]: String(body.add2).trim(),
        [COMPANY.COLUMNS.ADD3]: String(body.add3 || '').trim(),
        [COMPANY.COLUMNS.ADD4]: String(body.add4 || '').trim(),
        [COMPANY.COLUMNS.CITY]: body.city,
        [COMPANY.COLUMNS.PINCODE]: body.pincode,
        [COMPANY.COLUMNS.STATE]: body.state,
        [COMPANY.COLUMNS.COUNTRY]: body.country,
        [COMPANY.COLUMNS.PHONE]: body.phone,
        [COMPANY.COLUMNS.MOBILE]: body.mobile,
        [COMPANY.COLUMNS.EMAIL]: body.email,
        [COMPANY.COLUMNS.WEBSITE]: body.website,
        [COMPANY.COLUMNS.GSTIN]: body.gstin,
        [COMPANY.COLUMNS.FSSAI]: body.fssai,
        [COMPANY.COLUMNS.CREATED_BY]: created_by,
        [COMPANY.COLUMNS.UPDATED_BY]: created_by
      });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating company",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    const comp_id = response[0].id;
    if (body.bank_details.length > 0) {
      const banks = body.bank_details.map(bank => ({
        [COMPANY_BANK_DETAILS.COLUMNS.BANKACNO]: bank.bankacno,
        [COMPANY_BANK_DETAILS.COLUMNS.BANKNAME]: String(bank.bankname).trim(),
        [COMPANY_BANK_DETAILS.COLUMNS.ACNAME]: String(bank.acname).trim(),
        [COMPANY_BANK_DETAILS.COLUMNS.IFSCCODE]: bank.ifsccode,
        [COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID]: comp_id,
        [COMPANY_BANK_DETAILS.COLUMNS.UPDATED_BY]: created_by,
        [COMPANY_BANK_DETAILS.COLUMNS.CREATED_BY]: created_by
      }));

      const insertedBanks = await knex(`${COMPANY_BANK_DETAILS.NAME}`).insert(
        banks
      );

      if (!insertedBanks) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_IMPLEMENTED,
          message: "Error while creating company bank details",
          property: "",
          code: "NOT_IMPLEMENTED"
        });
      }
    }

    // Insert log entry
    await knex(COMPANY_LOGS.NAME).insert({
      [COMPANY_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [COMPANY_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [COMPANY_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [COMPANY_LOGS.COLUMNS.COMPANY_ID]: comp_id,
      [COMPANY_LOGS.COLUMNS.COMPANY_NAME]: String(body.company_fullname).trim()
    });

    return { success: true };
  }

  async function putCompany({ company_id, body, logTrace, userDetails }) {
    const knex = this;
    const created_by = userDetails.id;

    // Get all matching companies with conflicting fields, excluding the current company_id
    const conflictingCompany = await knex(COMPANY.NAME)
      .whereNot(COMPANY.COLUMNS.ID, company_id)
      .andWhere(builder => {
        builder
          .orWhere(COMPANY.COLUMNS.CODE, body.code)
          .orWhere(COMPANY.COLUMNS.SHORTNAME, body.company_short_name)
          .orWhere(COMPANY.COLUMNS.EMAIL, body.email)
          .orWhere(COMPANY.COLUMNS.FULLNAME, body.company_fullname);
      })
      .first();

    if (conflictingCompany) {
      let conflictFields = [];

      if (conflictingCompany[COMPANY.COLUMNS.CODE] === body.code) {
        conflictFields.push("code");
      }
      if (conflictingCompany[COMPANY.COLUMNS.SHORTNAME] === body.company_short_name) {
        conflictFields.push("shortname");
      }
      if (conflictingCompany[COMPANY.COLUMNS.EMAIL] === body.email) {
        conflictFields.push("email");
      }
      if (conflictingCompany[COMPANY.COLUMNS.FULLNAME] === body.company_fullname) {
        conflictFields.push("fullname");
      }

      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: `The following field(s) already exist: ${conflictFields.join(", ")}`,
        property: conflictFields.join(", "),
        code: "NOT_ACCEPTABLE"
      });
    }

    // Check if the company exists
    const exists_response = await knex(COMPANY.NAME)
      .where(COMPANY.COLUMNS.ID, company_id)
      .first();

    if (!exists_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Company not found to update",
        property: "",
        code: "NOT_FOUND"
      });
    }
    console.log(body.is_active, "values")
    // Update the company details
    const update_response = await knex(COMPANY.NAME)
      .where(COMPANY.COLUMNS.ID, company_id)
      .update({
        [COMPANY.COLUMNS.CODE]: String(body.code).trim(),
        [COMPANY.COLUMNS.SHORTNAME]: String(body.company_short_name).trim(),
        [COMPANY.COLUMNS.FULLNAME]: String(body.company_fullname).trim(),
        [COMPANY.COLUMNS.ADD1]: String(body.add1 || "").trim(),
        [COMPANY.COLUMNS.ADD2]: String(body.add2 || "").trim(),
        [COMPANY.COLUMNS.ADD3]: String(body.add3 || "").trim(),
        [COMPANY.COLUMNS.ADD4]: String(body.add4 || "").trim(),
        [COMPANY.COLUMNS.CITY]: body.city || null,
        [COMPANY.COLUMNS.PINCODE]: body.pincode || null,
        [COMPANY.COLUMNS.STATE]: body.state || null,
        [COMPANY.COLUMNS.COUNTRY]: body.country || null,
        [COMPANY.COLUMNS.PHONE]: body.phone || null,
        [COMPANY.COLUMNS.MOBILE]: body.mobile || null,
        [COMPANY.COLUMNS.EMAIL]: body.email || null,
        [COMPANY.COLUMNS.WEBSITE]: body.website || null,
        [COMPANY.COLUMNS.GSTIN]: body.gstin || null,
        [COMPANY.COLUMNS.FSSAI]: body.fssai || null,
        [COMPANY.COLUMNS.IS_ACTIVE]: Boolean(body.is_active),
        [COMPANY.COLUMNS.UPDATED_BY]: created_by,
        [COMPANY.COLUMNS.UPDATED_AT]: knex.fn.now(),
      });

    if (!update_response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating company",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // Update bank details if provided
    if (body.bank_details?.length > 0) {
      await Promise.all(
        body.bank_details.map(async (bank) => {
          const updatedBank = {
            [COMPANY_BANK_DETAILS.COLUMNS.BANKACNO]: bank.bankacno,
            [COMPANY_BANK_DETAILS.COLUMNS.BANKNAME]: String(bank.bankname).trim(),
            [COMPANY_BANK_DETAILS.COLUMNS.ACNAME]: String(bank.acname).trim(),
            [COMPANY_BANK_DETAILS.COLUMNS.IFSCCODE]: bank.ifsccode,
            [COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID]: company_id,
            [COMPANY_BANK_DETAILS.COLUMNS.UPDATED_AT]: knex.fn.now(),
            [COMPANY_BANK_DETAILS.COLUMNS.UPDATED_BY]: created_by
          };

          // Check if this specific bank account exists for the company
          const exists_response = await knex(COMPANY_BANK_DETAILS.NAME)
            .where(COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID, company_id)
            .first();

          if (exists_response) {
            // Update existing bank record
            await knex(COMPANY_BANK_DETAILS.NAME)
              .where(COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID, company_id)
              .update(updatedBank);
          } else {
            // Insert new bank record
            await knex(COMPANY_BANK_DETAILS.NAME)
              .insert(updatedBank);
          }
        })
      );
    }

    // Log the update operation
    await knex(COMPANY_LOGS.NAME).insert({
      [COMPANY_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [COMPANY_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [COMPANY_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [COMPANY_LOGS.COLUMNS.COMPANY_ID]: company_id,
      [COMPANY_LOGS.COLUMNS.COMPANY_NAME]: String(body.company_fullname).trim(),
    });

    return { success: true };
  }

  async function deleteCompany({ company_id, body, logTrace, userDetails }) {
    const knex = this;

    // Check if company exists
    const existingCompany = await knex(COMPANY.NAME)
      .where(COMPANY.COLUMNS.ID, company_id)
      .first();

    if (!existingCompany) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Company not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    // Check if deleting this company would leave the database empty
    const companyCount = await knex(COMPANY.NAME).count("* as count").first();
    if (Number(companyCount.count) <= 1) { // Prevents deleting last company
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Minimum One Company Mandatory",
        property: "",
        code: "NOT_ACCEPTABLE",
      });
    }

    // Start transaction
    await knex.transaction(async (trx) => {
      // Delete dependent records first
      await trx(COMPANY_BANK_DETAILS.NAME)
        .where(COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID, company_id)
        .del();

      // Delete company record
      const response = await trx(COMPANY.NAME)
        .where(COMPANY.COLUMNS.ID, company_id)
        .del();

      if (!response) {
        throw CustomError.create({
          httpCode: StatusCodes.NOT_FOUND,
          message: "Company not found",
          property: "",
          code: "NOT_FOUND",
        });
      }

      // Log the delete operation
      await trx(COMPANY_LOGS.NAME).insert({
        [COMPANY_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
        [COMPANY_LOGS.COLUMNS.USER_ID]: userDetails.id,
        [COMPANY_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
        [COMPANY_LOGS.COLUMNS.COMPANY_ID]: company_id,
        [COMPANY_LOGS.COLUMNS.COMPANY_NAME]: existingCompany.company_fullname
          ? String(existingCompany.company_fullname).trim()
          : null,
      });
    });

    return { success: true };
  }

  async function getCompany({ body, params, logTrace, queryString }) {
    const knex = this;
    const { search } = queryString;
    const query = knex
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
      .from(`${COMPANY.NAME} as ${COMPANY.NAME}`)
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
      .orderBy(COMPANY.COLUMNS.ID, "DESC");

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Company",
      logTrace
    });

    if (search && search.length >= 1) {
      query.where(builder => {
        builder
          .where(`${COMPANY.NAME}.${COMPANY.COLUMNS.CODE}`, "ilike", `%${search}%`)
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.SHORTNAME}`, "ilike", `%${search}%`)  // Ensure this is correct
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.FULLNAME}`, "ilike", `%${search}%`)
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.PHONE}`, "ilike", `%${search}%`)
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.EMAIL}`, "ilike", `%${search}%`)
          .orWhere(`${COMPANY.NAME}.${COMPANY.COLUMNS.WEBSITE}`, "ilike", `%${search}%`);
      });
    }

    const response = await query.paginate({
      pageSize: params.page_size,
      currentPage: params.current_page
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

    const companyWithBankDetails = await Promise.all(
      response.data.map(async company => {
        const bank_details = await knex(COMPANY_BANK_DETAILS.NAME).where(
          COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID,
          company.id
        );

        return {
          ...company,
          bank_details
        };
      })
    );

    return {
      data: companyWithBankDetails,
      meta: response.meta
    };
  }

  async function getCompanyInfo({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${COMPANY.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${COMPANY.NAME} as ${COMPANY.NAME}`)
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
      .where(`${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`, params.company_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Company",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Company info not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const companyWithBankDetails = await Promise.all(
      response.map(async company => {
        const bank_details = await knex(COMPANY_BANK_DETAILS.NAME).where(
          COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID,
          company.id
        );

        return { ...company, bank_details };
      })
    );

    return companyWithBankDetails[0];
  }


  async function getCompanyDetailsRepo({ body, params, logTrace }) {
    const knex = this;
    const query = knex
      .select([
        `${COMPANY.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${COMPANY.NAME} as ${COMPANY.NAME}`)
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


    logQuery({
      logger: fastify.log,
      query,
      context: "Get Company",
      logTrace
    });

    const response = await query;

    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Company Details",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const companyWithBankDetails = await Promise.all(
      response.map(async company => {
        const bank_details = await knex(COMPANY_BANK_DETAILS.NAME).where(
          COMPANY_BANK_DETAILS.COLUMNS.COMPANY_ID,
          company.id
        );

        return { ...company, bank_details };
      })
    );

    return companyWithBankDetails;
  }






  return {
    postCompany,
    putCompany,
    deleteCompany,
    getCompany,
    getCompanyInfo,
    getCompanyDetailsRepo
  };
}

module.exports = companyRepo;
