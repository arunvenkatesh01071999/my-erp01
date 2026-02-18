const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../../errorHandler");
const { logQuery } = require("../../../commons/helpers");
const { ACCOUNTMASTER } = require("../../commons");


function AccountMasterRepo(fastify) {
  async function getaccountMaster({ logTrace }) {
    const knex = this;
    const query = knex(ACCOUNTMASTER.NAME)
      .where(ACCOUNTMASTER.COLUMNS.IS_ACTIVE, "1")
      .orderBy(ACCOUNTMASTER.COLUMNS.ID, "DESC");
    logQuery({
      logger: fastify.log,
      query,
      context: "Get Account Master",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "Account Master not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response;
  }


  async function getAccountMasterPaginate({ queryString, params, logTrace }) {
    const knex = this;
    const { status, search } = queryString;

    const query = knex(ACCOUNTMASTER.NAME).orderBy(ACCOUNTMASTER.COLUMNS.ID, "DESC");

    if (Number(status) && Number(status) == 1) {
      query.where(
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`,
        1
      );
    }

    if (Number(status) && Number(status) == 2) {
      query.where(
        `${ACCOUNTMASTER.NAME}.${ACCOUNTMASTER.COLUMNS.IS_ACTIVE}`,
        0
      );
    }
    if (search && search.length >= 3) {
      query.where(function () {
        this.where(
          ACCOUNTMASTER.COLUMNS.ACNAME,
          "ilike",
          `%${search}%`
        )

      });
    };

    logQuery({
      logger: fastify.log,
      query,
      context: "Get ACCOUNTMASTER",
      logTrace
    });

    const response = await query.paginate({
      pageSize: params.page_size, // Customize as needed
      currentPage: params.current_page // Customize as needed
    });
    if (!response.data.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "ACCOUNTMASTER not found",
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
  async function postAccountMaster({ params, body, logTrace, userDetails }) {
    const knex = this;
    // const query = knex(ACCOUNTMASTER.NAME).where(
    //   ACCOUNTMASTER.COLUMNS.TYPEDESIGN_NAME,
    //   body.type_name
    // );

    // const exists_response = await query;

    // if (exists_response.length > 0) {
    //   throw CustomError.create({
    //     httpCode: StatusCodes.NOT_ACCEPTABLE,
    //     message: "ACCOUNTMASTER Name Already Exists",
    //     property: "",
    //     code: "NOT_ACCEPTABLE"
    //   });
    // }



    const query_insert = await knex(`${ACCOUNTMASTER.NAME}`).insert({
      [ACCOUNTMASTER.COLUMNS.ACNAME]: body.acname,
      [ACCOUNTMASTER.COLUMNS.ACTYPEID]: body.actype_id,
      [ACCOUNTMASTER.COLUMNS.COMPANY_ID]: body.company_id,
      [ACCOUNTMASTER.COLUMNS.IS_ACTIVE]: parseInt(1),
      [ACCOUNTMASTER.COLUMNS.CREATED_BY]: userDetails.id
      // [ACCOUNTMASTER.COLUMNS.CREATED_BY]: parseInt(1)


    });

    const response = await query_insert;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while creating ACCOUNTMASTER",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function putAccountmaster({ acc_id, body, logTrace, userDetails }) {
    const knex = this;
    const query = knex(ACCOUNTMASTER.NAME).where(ACCOUNTMASTER.COLUMNS.ID, acc_id);

    const exists_response = await query;
    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "Acc_id not found to update",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_update = await knex(`${ACCOUNTMASTER.NAME}`)
      .where(`${ACCOUNTMASTER.COLUMNS.ID}`, acc_id)
      .update({
        [ACCOUNTMASTER.COLUMNS.ACNAME]: body.acname,
        [ACCOUNTMASTER.COLUMNS.ACTYPEID]: body.actype_id,
        [ACCOUNTMASTER.COLUMNS.COMPANY_ID]: body.company_id,
        [ACCOUNTMASTER.COLUMNS.IS_ACTIVE]: parseInt(1),
        // [TYPEDESIGN.COLUMNS.UPDATED_BY]: userDetails.result.id
        [ACCOUNTMASTER.COLUMNS.UPDATED_BY]: userDetails.id

      });

    const response = await query_update;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_IMPLEMENTED,
        message: "Error while updating ACCOUNTMASTER",
        property: "",
        code: "NOT_IMPLEMENTED"
      });
    }

    return { success: true };
  }

  async function deleteAccountMaster({ acc_id, body, logTrace }) {
    const knex = this;
    const query = knex(ACCOUNTMASTER.NAME).where(ACCOUNTMASTER.COLUMNS.ID, acc_id);

    const exists_response = await query;

    if (!exists_response.length > 0) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_ACCEPTABLE,
        message: "ACCOUNTMASTER not found to delete",
        property: "",
        code: "NOT_ACCEPTABLE"
      });
    }

    const query_delete = knex(ACCOUNTMASTER.NAME)
      .where(ACCOUNTMASTER.COLUMNS.ID, acc_id)
      .del();
    logQuery({
      logger: fastify.log,
      query,
      context: "delete ACCOUNTMASTER",
      logTrace
    });
    const response = await query_delete;
    if (!response) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "ACCOUNTMASTER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return { success: true };
  }

  async function getAccountMasterInfo({ params, logTrace }) {
    const knex = this;
    const query = knex(ACCOUNTMASTER.NAME).where(ACCOUNTMASTER.COLUMNS.ID, params.acc_id);
    logQuery({
      logger: fastify.log,
      query,
      context: "Get ACCOUNTMASTER Info",
      logTrace
    });
    const response = await query;
    if (!response.length) {
      throw CustomError.create({
        httpCode: StatusCodes.NOT_FOUND,
        message: "ACCOUNTMASTER not found",
        property: "",
        code: "NOT_FOUND"
      });
    }
    return response[0];
  }

  return {
    getAccountMasterPaginate,
    postAccountMaster,
    putAccountmaster,
    getaccountMaster,
    deleteAccountMaster,
    getAccountMasterInfo
  };
}

module.exports = AccountMasterRepo;
