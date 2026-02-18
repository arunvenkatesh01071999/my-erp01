const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { SUPPLIER, SUPPLIER_LOGS, PURCHASE_MASTER, VENDORS_MAPPING, COMPANY, CUSTOMER, SUB_GROUP, ALLOCATE_GROUP } = require("../commons/constants");
const { STATES } = require("../../../masterData/commons/constants");
const { CITIES } = require("../../../masterData/commons/constants");
const { COUNTRIES } = require("../../../masterData/commons/constants");

function supplierRepo(fastify) {
  async function getCustomer({ logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.ID}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.NAME}`,
        `${CUSTOMER.NAME}.${CUSTOMER.COLUMNS.IS_ACTIVE}`
      ])
      .from(`${CUSTOMER.NAME} as ${CUSTOMER.NAME}`)
      .orderBy(CUSTOMER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Customer Details",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Customer not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }

  async function getSupplierPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.BANK_AC_NO} as bankacno`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.AC_NAME} as acname`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.FSSAI} as fssai`,
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
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .orderBy(SUPPLIER.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 2) {
      query.where(function () {
        this.where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SHORTNAME}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.MOBILE}`, "ilike", `%${search}%`)
          .orWhere(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.PHONE}`, "ilike", `%${search}%`)
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
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

  async function postSupplier({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, body.supplier_name);

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Supplier Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_insert = await knex(`${SUPPLIER.NAME}`)
      .returning("id")
      .insert({
        [SUPPLIER.COLUMNS.SUPPLIER_NAME]: body.supplier_name,
        [SUPPLIER.COLUMNS.SHORTNAME]: body.short_name,
        [SUPPLIER.COLUMNS.ADD1]: body.add1,
        [SUPPLIER.COLUMNS.ADD2]: body.add2,
        [SUPPLIER.COLUMNS.ADD3]: body.add3 || "",
        [SUPPLIER.COLUMNS.ADD4]: body.add4 || "",
        [SUPPLIER.COLUMNS.COMPANY_ID]: body.company_id,
        [SUPPLIER.COLUMNS.COUNTRY_ID]: body.country,
        [SUPPLIER.COLUMNS.STATE_ID]: body.state,
        [SUPPLIER.COLUMNS.CITY_ID]: body.city,
        [SUPPLIER.COLUMNS.PINCODE]: body.pincode,
        [SUPPLIER.COLUMNS.PHONE]: body.phone,
        [SUPPLIER.COLUMNS.MOBILE]: body.mobile,
        [SUPPLIER.COLUMNS.EMAIL]: body.email,
        [SUPPLIER.COLUMNS.WEBSITE]: body.website,
        [SUPPLIER.COLUMNS.GSTIN]: body.gstin,
        [SUPPLIER.COLUMNS.CUSTTYPE]: body.custtype,
        [SUPPLIER.COLUMNS.BANK_AC_NO]: body.bankacno,
        [SUPPLIER.COLUMNS.BANKNAME]: body.bankname,
        [SUPPLIER.COLUMNS.AC_NAME]: body.acname,
        [SUPPLIER.COLUMNS.IFSCCODE]: body.ifsccode,
        [SUPPLIER.COLUMNS.FSSAI]: body.fssai,
        [SUPPLIER.COLUMNS.OP_BAL]: body.op_bal,
        [SUPPLIER.COLUMNS.IS_ACTIVE]: body.is_active,
        [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
        [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating supplier",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const supplier_id = response[0].id;

    // Insert log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(body.supplier_name).trim()
    });

    return { success: true };
  }

  async function putSupplier({ supplier_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query1 = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.SUPPLIER_NAME, body.supplier_name)
      .whereNot(SUPPLIER.COLUMNS.ID, supplier_id);

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

    const query_update = await knex(`${SUPPLIER.NAME}`)
      .where(`${SUPPLIER.COLUMNS.ID}`, supplier_id)
      .update({
        [SUPPLIER.COLUMNS.SUPPLIER_NAME]: body.supplier_name,
        [SUPPLIER.COLUMNS.SHORTNAME]: body.short_name,
        [SUPPLIER.COLUMNS.ADD1]: body.add1,
        [SUPPLIER.COLUMNS.ADD2]: body.add2,
        [SUPPLIER.COLUMNS.ADD3]: body.add3 || "",
        [SUPPLIER.COLUMNS.ADD4]: body.add4 || "",
        [SUPPLIER.COLUMNS.COMPANY_ID]: body.company_id,
        [SUPPLIER.COLUMNS.COUNTRY_ID]: body.country,
        [SUPPLIER.COLUMNS.STATE_ID]: body.state,
        [SUPPLIER.COLUMNS.CITY_ID]: body.city,
        [SUPPLIER.COLUMNS.PINCODE]: body.pincode,
        [SUPPLIER.COLUMNS.PHONE]: body.phone,
        [SUPPLIER.COLUMNS.MOBILE]: body.mobile,
        [SUPPLIER.COLUMNS.EMAIL]: body.email,
        [SUPPLIER.COLUMNS.WEBSITE]: body.website,
        [SUPPLIER.COLUMNS.GSTIN]: body.gstin,
        [SUPPLIER.COLUMNS.CUSTTYPE]: body.custtype,
        [SUPPLIER.COLUMNS.BANK_AC_NO]: body.bankacno,
        [SUPPLIER.COLUMNS.BANKNAME]: body.bankname,
        [SUPPLIER.COLUMNS.AC_NAME]: body.acname,
        [SUPPLIER.COLUMNS.IFSCCODE]: body.ifsccode,
        [SUPPLIER.COLUMNS.FSSAI]: body.fssai,
        [SUPPLIER.COLUMNS.OP_BAL]: body.op_bal,
        [SUPPLIER.COLUMNS.IS_ACTIVE]: body.is_active,
        [SUPPLIER.COLUMNS.CREATED_BY]: userDetails.id,
        [SUPPLIER.COLUMNS.UPDATED_BY]: userDetails.id
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating  supplier",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }
    // Update log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(body.supplier_name).trim()
    });

    return { success: true };
  }

  async function deleteSupplier({ supplier_id, body, logTrace, userDetails }) {
    const knex = this;
    const existssupplierquery = knex(SUPPLIER.NAME).
      where(SUPPLIER.COLUMNS.ID, supplier_id);

    const exists_response = await existssupplierquery;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "supplier not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const validationquery = knex(PURCHASE_MASTER.NAME).
      where(PURCHASE_MASTER.COLUMNS.PARTYCODE, supplier_id);

    const exists_response1 = await validationquery;
    console.log(exists_response1)
    if (exists_response1.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Cannot delete supplier,Associated with a purchase.",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query = knex(SUPPLIER.NAME)
      .where(SUPPLIER.COLUMNS.ID, supplier_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete supplier",
      logTrace
    });
    const response = await query;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(SUPPLIER_LOGS.NAME).insert({
      [SUPPLIER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [SUPPLIER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [SUPPLIER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_ID]: supplier_id,
      [SUPPLIER_LOGS.COLUMNS.SUPPLIER_NAME]: String(exists_response[0].supplier_name).trim()
    });

    return { success: true };
  }


  async function getSupplierInfo({ params, logTrace }) {
    const knex = this;
    // const query = knex(SUPPLIER.NAME).where(SUPPLIER.COLUMNS.ID, params.id);

    const query = knex
      .select([
        `${SUPPLIER.NAME}.*`,
        `${STATES.NAME}.${STATES.COLUMNS.NAME} as state_name`,
        `${CITIES.NAME}.${CITIES.COLUMNS.NAME} as city_name`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.NAME} as country_name`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .leftJoin(
        `${STATES.NAME} as ${STATES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.STATE_ID}`,
        `${STATES.NAME}.${STATES.COLUMNS.ID}`
      )
      .leftJoin(
        `${CITIES.NAME} as ${CITIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.CITY_ID}`,
        `${CITIES.NAME}.${CITIES.COLUMNS.ID}`
      )
      .leftJoin(
        `${COUNTRIES.NAME} as ${COUNTRIES.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COUNTRY_ID}`,
        `${COUNTRIES.NAME}.${COUNTRIES.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`, params.supplier_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get SUPPLIER Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "SUPPLIER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }


  async function getSupplierByProducts({ logTrace }) {
    const knex = this;

    const query = knex
      .distinct([
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.SUPPLIER_NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD1}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD2}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD3}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ADD4}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.GSTIN} as supplier_gstin`, // ✅ Fixed alias
        `${COMPANY.NAME}.${COMPANY.COLUMNS.GSTIN} as company_gstin`
      ])
      .from(`${SUPPLIER.NAME} as ${SUPPLIER.NAME}`)
      .innerJoin(
        `${VENDORS_MAPPING.NAME} as ${VENDORS_MAPPING.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.ID}`,
        `${VENDORS_MAPPING.NAME}.${VENDORS_MAPPING.COLUMNS.VENDORS_ID}`
      )
      .innerJoin(
        `${COMPANY.NAME} as ${COMPANY.NAME}`,
        `${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.COMPANY_ID}`,
        `${COMPANY.NAME}.${COMPANY.COLUMNS.ID}`
      )
      .where(`${SUPPLIER.NAME}.${SUPPLIER.COLUMNS.IS_ACTIVE}`, true);

    logQuery({
      logger: fastify.log,
      query,
      context: "Get Supplier",
      logTrace
    });

    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Supplier not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    const updatedSupplierDetails = response.map((detail) => ({
      ...detail,
      gst: detail.supplier_gstin.slice(0, 2) === detail.company_gstin.slice(0, 2),
      igst: detail.supplier_gstin.slice(0, 2) !== detail.company_gstin.slice(0, 2),

    }));

    return updatedSupplierDetails;
  }


  return {
    getCustomer,
    getSupplierPaginate,
    postSupplier,
    putSupplier,
    deleteSupplier,
    getSupplierInfo,
    getSupplierByProducts
  };
}

module.exports = supplierRepo;
