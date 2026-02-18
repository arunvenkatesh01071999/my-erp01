const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { OFFER, OFFER_LOGS } = require("../commons/constants");
const { ITEM } = require("../../commons");

function OfferTypeRepo(fastify) {
  async function getOfferType({ logTrace }) {
    const knex = this;
    const query = knex(OFFER.NAME).where(OFFER.COLUMNS.IS_ACTIVE, "1").orderBy(OFFER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get OFFER",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OFFER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function getOfferTypePaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;
    const query = knex(OFFER.NAME).orderBy(OFFER.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${OFFER.NAME}.${OFFER.COLUMNS.IS_ACTIVE}`,
        true
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${OFFER.NAME}.${OFFER.COLUMNS.IS_ACTIVE}`,
        false
      );
    }

    if (search && search.length >= 3) {
      query.where(function () {
        this.where(OFFER.COLUMNS.ONAME, "ilike", `%${search}%`);
      });
    }
    logQuery({
      logger: fastify.log,
      query,
      context: "Get OFFER",
      logTrace
    });
    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OFFER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }
  async function postOfferType({ params, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OFFER.NAME)
      .where(OFFER.COLUMNS.ONAME, body.oname);

    const exists_response = await query;

    if (exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OFFER Name Already Exists",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }
    console.log(body);
    const query_insert = await knex(`${OFFER.NAME}`)
      .returning(['oid']) // Fixed `retrning` typo
      .insert({
        [OFFER.COLUMNS.ONAME]: body.oname,
        [OFFER.COLUMNS.COMPANY_ID]: body.company_id,
        [OFFER.COLUMNS.IS_ACTIVE]: body.is_active,
        [OFFER.COLUMNS.CREATED_BY]: userDetails.id,
        [OFFER.COLUMNS.UPDATED_BY]: userDetails.id
      });


    // Ensure insert was successful
    if (!query_insert || query_insert.length === 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating OFFER",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    const insertedOffersId = query_insert[0].oid;

    // Insert log entry
    await knex(OFFER_LOGS.NAME).insert({
      [OFFER_LOGS.COLUMNS.OPERATION_NAME]: "CREATE",
      [OFFER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OFFER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OFFER_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [OFFER_LOGS.COLUMNS.OFFER_ID]: insertedOffersId,
      [OFFER_LOGS.COLUMNS.ONAME]: String(body.oname).trim()
    });

    return { success: true };
  }
  async function putOfferType({ oid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OFFER.NAME).where(OFFER.COLUMNS.ID, oid);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OFFER not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${OFFER.NAME}`)
      .where(`${OFFER.COLUMNS.ID}`, oid)
      .update({
        [OFFER.COLUMNS.ONAME]: body.oname,
        [OFFER.COLUMNS.COMPANY_ID]: body.company_id,
        [OFFER.COLUMNS.IS_ACTIVE]: body.is_active,
        [OFFER.COLUMNS.UPDATED_AT]: new Date()
      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updatind OFFER",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    // UPDATE log entry
    await knex(OFFER_LOGS.NAME).insert({
      [OFFER_LOGS.COLUMNS.OPERATION_NAME]: "UPDATE",
      [OFFER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OFFER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OFFER_LOGS.COLUMNS.COMPANY_ID]: body.company_id,
      [OFFER_LOGS.COLUMNS.OFFER_ID]: oid,
      [OFFER_LOGS.COLUMNS.ONAME]: String(body.oname).trim()
    });

    return { success: true };
  }
  async function deleteOfferType({ oid, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(OFFER.NAME).where(OFFER.COLUMNS.ID, oid);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "OFFER not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    // const query1 = knex(ITEM.NAME).where(
    //   ITEM.COLUMNS.UOM_ID,
    //   unit_id
    // );

    // const exists_response1 = await query1;

    // if (exists_response1.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "Unit is mapped with a product and cannot be deleted",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }

    const query_delete = knex(OFFER.NAME)
      .where(OFFER.COLUMNS.ID, oid)
      .del();
    logQuery({
      logger: fastify.log,
      query: query_delete,
      context: "delete OFFER",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "OFFER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }

    // Delete log entry
    await knex(OFFER_LOGS.NAME).insert({
      [OFFER_LOGS.COLUMNS.OPERATION_NAME]: "DELETE",
      [OFFER_LOGS.COLUMNS.USER_ID]: userDetails.id,
      [OFFER_LOGS.COLUMNS.USER_NAME]: userDetails.user_name,
      [OFFER_LOGS.COLUMNS.OFFER_ID]: oid,
      [OFFER_LOGS.COLUMNS.COMPANY_ID]: exists_response[0]?.company_id
        ? String(exists_response[0].company_id).trim()
        : null,
      [OFFER_LOGS.COLUMNS.ONAME]: exists_response[0]?.oname
        ? String(exists_response[0].oname).trim()
        : null,
    });
    return { success: true };
  }
  async function getOfferTypeInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(OFFER.NAME).where(OFFER.COLUMNS.ID, params.oid);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get OFFER Info",
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
    getOfferType,
    postOfferType,
    putOfferType,
    deleteOfferType,
    getOfferTypeInfo,
    getOfferTypePaginate
  };
}

module.exports = OfferTypeRepo;
